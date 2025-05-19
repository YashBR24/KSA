const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');

const {
    getActivePlans,
    getAllBookings,
    getAllPlans,
    getUpcomingBookings,
    takeAttendance,
    getAttendance,
    updateTrainees,
    newTrainee,
    getStaffAttendance,
    getTransactionsByInstitute,
    getAllInstitutes
} = require('../controllers/ManagerGroundController');
const DetailsAcademy = require('../models/DetailsAcademy');
const Academy = require('../models/Academy');
const Transaction = require('../models/Transaction');
const Sport = require('../models/Sport');
const Institute = require('../models/Institute');
const User = require('../models/user');
const Batch = require('../models/Batch');
const { log } = require("../Logs/logs");

// Ensure uploads directory exists
const uploadDir = 'Uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration with unique filenames
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error("Only images (jpeg, jpg, png) are allowed"));
        }
    },
});

// Helper function to calculate balance from transactions
const calculateBalanceFromTransactions = async (instituteId) => {
    const transactions = await Transaction.find({ institute: instituteId });
    let balance = 0;
    transactions.forEach(transaction => {
        if (transaction.amt_in_out === "IN") {
            balance += Number(transaction.amount);
        } else if (transaction.amt_in_out === "OUT") {
            balance -= Number(transaction.amount);
        }
    });
    return balance;
};

// Helper function to generate random string
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

async function calculateTotalPaidAmount(trainee_id, trans_identification) {
    const transactions = await Transaction.find({
        identification: trans_identification,
        amt_in_out: "IN"
    });
    return transactions.reduce((total, trans) => total + Number(trans.amount), 0);
}

// Routes from controllers
router.post('/all-plans', (req, res, next) => {
    log(`ROUTING_ALL_PLANS`);
    getAllPlans(req, res, next);
});
router.post('/all-bookings', (req, res, next) => {
    log(`ROUTING_ALL BOOKINGS`);
    getAllBookings(req, res, next);
});
router.post('/take-attendance', (req, res, next) => {
    log(`ROUTING_TAKE_ATTENDANCE`);
    takeAttendance(req, res, next);
});
router.post('/trainee-attendance', (req, res, next) => {
    log(`ROUTING_TRAINEE_ATTENDANCE`);
    getAttendance(req, res, next);
});
router.post('/staff-attendance', (req, res, next) => {
    log(`ROUTING_STAFF_ATTENDANCE`);
    getStaffAttendance(req, res, next);
});
router.post('/update-trainee-student', (req, res, next) => {
    log(`ROUTING_UPDATE_TRAINEES`);
    updateTrainees(req, res, next);
});
router.post('/transactions-by-institute', (req, res, next) => {
    log(`ROUTING_TRANSACTIONS_BY_INSTITUTE`);
    getTransactionsByInstitute(req, res, next);
});
router.get("/institutes", (req, res, next) => {
    log(`ROUTING_GET_ALL_INSTITUTES`);
    getAllInstitutes(req, res, next);
});

// Add new trainee
router.post("/add-new-trainee", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "traineeSignature", maxCount: 1 },
    { name: "fatherSignature", maxCount: 1 },
]), async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            log(`NO_AUTH_HEADER`);
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const userId = authHeader.split(' ')[1];
        if (!userId) {
            log(`NO_USER_ID_IN_AUTH`);
            return res.status(401).json({ message: "User ID not provided in authorization" });
        }

        const {
            name, method, payment_status, initial_payment, father, dob, address, phone,
            plan_id, sport_id, institute_id, batch_id, amount, occupation,
            current_class, name_of_school, dateAndPlace, start_date, expiry_date
        } = req.body;
        log(`ADD_NEW_TRAINEE_${name}_${phone}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const rollno = await Academy.countDocuments();
        const roll_no = "KSA" + (rollno + 1);

        const planDetails = await DetailsAcademy.findById(plan_id);
        if (!planDetails) {
            log(`PLAN_NOT_FOUND_${plan_id}`);
            return res.status(404).send("Plan not found");
        }

        const sportDetails = await Sport.findById(sport_id);
        if (!sportDetails) {
            log(`SPORT_NOT_FOUND_${sport_id}`);
            return res.status(404).send("Sport not found");
        }

        const instituteDetails = await Institute.findById(institute_id);
        if (!instituteDetails) {
            log(`INSTITUTE_NOT_FOUND_${institute_id}`);
            return res.status(404).send("Institute not found");
        }

        const batchDetails = await Batch.findById(batch_id);
        if (!batchDetails) {
            log(`BATCH_NOT_FOUND_${batch_id}`);
            return res.status(404).send("Batch not found");
        }

        // Validate that the batch belongs to the selected sport
        if (batchDetails.sport_id.toString() !== sport_id) {
            log(`INVALID_BATCH_FOR_SPORT_${batch_id}`);
            return res.status(400).send("Selected batch does not belong to the selected sport");
        }

        const session = planDetails.name;
        const today = moment();
        const firstDate = start_date ? moment(start_date) : today.add(1, "days");
        const secondDate = expiry_date ? moment(expiry_date) : moment(today).add(planDetails.plan_limit, "days");

        let photoFilename = null;
        let traineeSignatureFilename = null;
        let fatherSignatureFilename = null;

        if (req.files?.photo?.[0]) {
            const originalPath = req.files.photo[0].path;
            photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, photoFilename));
        }
        if (req.files?.traineeSignature?.[0]) {
            const originalPath = req.files.traineeSignature[0].path;
            traineeSignatureFilename = `${roll_no}_traineeSignature${path.extname(req.files.traineeSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, traineeSignatureFilename));
        }
        if (req.files?.fatherSignature?.[0]) {
            const originalPath = req.files.fatherSignature[0].path;
            fatherSignatureFilename = `${roll_no}_fatherSignature${path.extname(req.files.fatherSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, fatherSignatureFilename));
        }

        // Validate payment status and amounts
        const totalAmount = Number(amount) || 0;
        const initialPayment = Number(initial_payment) || 0;
        let pendingAmount = 0;
        let validatedPaymentStatus = payment_status?.toUpperCase() || 'PENDING';

        if (!['PAID', 'PARTIAL', 'PENDING'].includes(validatedPaymentStatus)) {
            log(`INVALID_PAYMENT_STATUS_${validatedPaymentStatus}`);
            return res.status(400).send("Invalid payment status");
        }

        if (validatedPaymentStatus === 'PAID' && initialPayment !== totalAmount) {
            log(`INVALID_PAID_AMOUNT_${initialPayment}_${totalAmount}`);
            return res.status(400).send("Initial payment must equal total amount for PAID status");
        }

        if (validatedPaymentStatus === 'PARTIAL') {
            if (initialPayment >= totalAmount || initialPayment <= 0) {
                log(`INVALID_PARTIAL_AMOUNT_${initialPayment}_${totalAmount}`);
                return res.status(400).send("Initial payment must be less than total amount and greater than 0 for PARTIAL status");
            }
            pendingAmount = totalAmount - initialPayment;
        }

        if (validatedPaymentStatus === 'PENDING') {
            if (initialPayment > 0) {
                log(`INVALID_PENDING_AMOUNT_${initialPayment}`);
                return res.status(400).send("Initial payment must be 0 for PENDING status");
            }
            pendingAmount = totalAmount;
        }

        const transIdentification = generateRandomString(10);
        const newTrainee = new Academy({
            roll_no,
            name,
            father,
            dob,
            address,
            session,
            from: firstDate,
            to: secondDate,
            phone,
            plan_id,
            sport_id,
            institute_id,
            batch_id,
            amount: totalAmount,
            occupation,
            current_class,
            name_of_school,
            date_and_place: dateAndPlace,
            photo: photoFilename,
            signature: traineeSignatureFilename || "",
            father_signature: fatherSignatureFilename || "",
            payment_status: validatedPaymentStatus,
            pending_amount: pendingAmount,
            method,
            trans_identification: transIdentification,
            delete: false,
            createdOn: new Date(req.body.createdOn || Date.now())
        });
        await newTrainee.save();

        // Record transaction if there is an initial payment
        if (initialPayment > 0) {
            const currentBalance = await calculateBalanceFromTransactions(institute_id);
            const newBalance = currentBalance + initialPayment;

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount: initialPayment,
                description: `ACADEMY_NEW_${name}_${roll_no}_${sportDetails.name}_${validatedPaymentStatus}`,
                balance_before_transaction: currentBalance,
                balance_after_transaction: newBalance,
                method: method || 'CASH',
                identification: transIdentification,
                institute: institute_id,
                institute_name: instituteDetails.name,
                user: userId,
                createdAt: newTrainee.createdOn,
            });
            await newTrans.save();
            log(`TRANSACTION_RECORDED_${roll_no}_${initialPayment}`);
        }

        log(`SUCCESSFULLY_ADDED_TRAINEE_${roll_no}`);
        res.status(200).json({
            message: "Trainee added successfully",
            trainee: newTrainee,
            pending_amount: pendingAmount
        });
    } catch (error) {
        log(`ERROR_ADDING_TRAINEE`);
        console.error('Error in /add-new-trainee:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Add partial payment
router.post("/add-partial-payment", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            log(`NO_AUTH_HEADER`);
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const userId = authHeader.split(' ')[1];
        if (!userId) {
            log(`NO_USER_ID_IN_AUTH`);
            return res.status(401).json({ message: "User ID not provided in authorization" });
        }

        const { trainee_id, payment_amount, payment_method } = req.body;
        log(`ADD_PARTIAL_PAYMENT_${trainee_id}_${payment_amount}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const trainee = await Academy.findById(trainee_id);
        if (!trainee) {
            log(`TRAINEE_NOT_FOUND_${trainee_id}`);
            return res.status(404).send("Trainee not found");
        }

        if (trainee.payment_status === 'PAID') {
            log(`ALREADY_FULLY_PAID_${trainee_id}`);
            return res.status(400).send("Trainee has already paid in full");
        }

        const paymentAmount = Number(payment_amount);
        if (paymentAmount <= 0 || isNaN(paymentAmount)) {
            log(`INVALID_PAYMENT_AMOUNT_${payment_amount}`);
            return res.status(400).send("Payment amount must be greater than 0");
        }

        if (paymentAmount > trainee.pending_amount) {
            log(`EXCEEDS_PENDING_AMOUNT_${payment_amount}_${trainee.pending_amount}`);
            return res.status(400).send("Payment amount exceeds pending amount");
        }

        const instituteDetails = await Institute.findById(trainee.institute_id);
        if (!instituteDetails) {
            log(`INSTITUTE_NOT_FOUND_${trainee.institute_id}`);
            return res.status(404).send("Institute not found");
        }

        const sportDetails = await Sport.findById(trainee.sport_id);
        if (!sportDetails) {
            log(`SPORT_NOT_FOUND_${trainee.sport_id}`);
            return res.status(404).send("Sport not found");
        }

        // Update trainee's pending amount and payment status
        trainee.pending_amount -= paymentAmount;
        trainee.payment_status = trainee.pending_amount === 0 ? 'PAID' : 'PARTIAL';
        trainee.method = payment_method;
        await trainee.save();

        // Record transaction
        const currentBalance = await calculateBalanceFromTransactions(trainee.institute_id);
        const newBalance = currentBalance + paymentAmount;

        const newTrans = new Transaction({
            amt_in_out: "IN",
            amount: paymentAmount,
            description: `PARTIAL_PAYMENT_${trainee.name}_${trainee.roll_no}_${sportDetails.name}`,
            balance_before_transaction: currentBalance,
            balance_after_transaction: newBalance,
            method: payment_method || 'CASH',
            identification: trainee.trans_identification,
            institute: trainee.institute_id,
            institute_name: instituteDetails.name,
            user: userId
        });
        await newTrans.save();
        log(`TRANSACTION_RECORDED_${trainee.roll_no}_${payment_amount}`);

        log(`SUCCESSFULLY_ADDED_PARTIAL_PAYMENT_${trainee_id}`);
        res.status(200).json({
            message: "Partial payment added successfully",
            trainee,
            pending_amount: trainee.pending_amount
        });
    } catch (error) {
        log(`ERROR_ADDING_PARTIAL_PAYMENT_${trainee_id || 'UNKNOWN'}`);
        console.error('Error in /add-partial-payment:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Update/Edit trainee
router.put("/update-trainee/:id", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "traineeSignature", maxCount: 1 },
    { name: "fatherSignature", maxCount: 1 },
]), async (req, res) => {
    try {
        const traineeId = req.params.id;
        log(`UPDATING_TRAINEE_${traineeId}`);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            log(`NO_AUTH_HEADER`);
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const userId = authHeader.split(' ')[1];
        if (!userId) {
            log(`NO_USER_ID_IN_AUTH`);
            return res.status(401).json({ message: "User ID not provided in authorization" });
        }

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const {
            name, father, dob, address, phone, occupation, current_class, name_of_school,
            dateAndPlace, start_date, expiry_date, sport_id, institute_id, plan_id, batch_id,
            amount, initial_payment, payment_status, method
        } = req.body;

        const existingTrainee = await Academy.findById(traineeId);
        if (!existingTrainee) {
            log(`TRAINEE_NOT_FOUND_${traineeId}`);
            return res.status(404).send("Trainee not found");
        }

        // Check if the update involves a plan change
        const isPlanChange = plan_id && plan_id !== existingTrainee.plan_id.toString();

        // Validate sport_id if provided
        let sportDetails = null;
        if (sport_id) {
            sportDetails = await Sport.findById(sport_id);
            if (!sportDetails) {
                log(`SPORT_NOT_FOUND_${sport_id}`);
                return res.status(404).send("Sport not found");
            }
        }

        // Validate institute_id if provided
        let instituteDetails = null;
        if (institute_id) {
            instituteDetails = await Institute.findById(institute_id);
            if (!instituteDetails) {
                log(`INSTITUTE_NOT_FOUND_${institute_id}`);
                return res.status(404).send("Institute not found");
            }
        }

        // Validate batch_id if provided
        if (batch_id) {
            const batchDetails = await Batch.findById(batch_id);
            if (!batchDetails) {
                log(`BATCH_NOT_FOUND_${batch_id}`);
                return res.status(404).send("Batch not found");
            }
            // Validate that the batch belongs to the selected sport
            if (sport_id && batchDetails.sport_id.toString() !== sport_id) {
                log(`INVALID_BATCH_FOR_SPORT_${batch_id}`);
                return res.status(400).send("Selected batch does not belong to the selected sport");
            }
        }

        // Handle plan change and payment updates
        let session = existingTrainee.session;
        let newAmount = existingTrainee.amount;
        let newPendingAmount = existingTrainee.pending_amount;
        let newPaymentStatus = existingTrainee.payment_status;
        let newExpiryDate = existingTrainee.to;
        const transIdentification = existingTrainee.trans_identification; // Retain original trans_identification

        if (isPlanChange) {
            const planDetails = await DetailsAcademy.findById(plan_id);
            if (!planDetails) {
                log(`PLAN_NOT_FOUND_${plan_id}`);
                return res.status(404).send("Plan not found");
            }
            session = planDetails.name;

            // Update expiry date based on new plan
            const today = moment();
            const firstDate = start_date ? moment(start_date) : moment(existingTrainee.from);
            newExpiryDate = expiry_date ? moment(expiry_date) : moment(firstDate).add(planDetails.plan_limit, "days");

            // Update amount and payment details
            newAmount = Number(amount) || existingTrainee.amount;
            const newInitialPayment = Number(initial_payment) || 0;

            // Calculate total previously paid amount
            const totalPaid = await calculateTotalPaidAmount(traineeId, transIdentification);

            // Validate new amount
            if (newAmount < totalPaid) {
                log(`INVALID_NEW_AMOUNT_${newAmount}_${totalPaid}`);
                return res.status(400).send("New plan amount cannot be less than previously paid amount");
            }

            // Handle payment status
            const requestedPaymentStatus = payment_status?.toUpperCase() || 'PENDING';
            if (!['PAID', 'PARTIAL', 'PENDING'].includes(requestedPaymentStatus)) {
                log(`INVALID_PAYMENT_STATUS_${requestedPaymentStatus}`);
                return res.status(400).send("Invalid payment status");
            }

            if (requestedPaymentStatus === 'PAID') {
                // Calculate remaining amount needed to fully pay
                const remainingPayment = newAmount - totalPaid;
                if (remainingPayment < 0) {
                    log(`OVERPAYMENT_${newInitialPayment}_${totalPaid}_${newAmount}`);
                    return res.status(400).send("Previous payments exceed new plan amount");
                }

                if (remainingPayment > 0) {
                    // Create a transaction for the remaining amount
                    const currentBalance = await calculateBalanceFromTransactions(institute_id || existingTrainee.institute_id);
                    const newBalance = currentBalance + remainingPayment;

                    const newTrans = new Transaction({
                        amt_in_out: "IN",
                        amount: remainingPayment,
                        description: `PLAN_CHANGE_FULL_PAYMENT_${name || existingTrainee.name}_${existingTrainee.roll_no}_${sportDetails?.name || 'UNKNOWN'}_PAID`,
                        balance_before_transaction: currentBalance,
                        balance_after_transaction: newBalance,
                        method: method || 'CASH',
                        identification: transIdentification,
                        institute: institute_id || existingTrainee.institute_id,
                        institute_name: instituteDetails?.name || (await Institute.findById(existingTrainee.institute_id))?.name,
                        user: userId,
                        createdAt: new Date()
                    });
                    await newTrans.save();
                    log(`TRANSACTION_RECORDED_${existingTrainee.roll_no}_${remainingPayment}`);
                }

                // Set to PAID
                newPendingAmount = 0;
                newPaymentStatus = 'PAID';
            } else {
                // Calculate new pending amount for PARTIAL or PENDING
                newPendingAmount = newAmount - totalPaid - newInitialPayment;

                // Validate payment amounts
                if (newPendingAmount < 0) {
                    log(`OVERPAYMENT_${newInitialPayment}_${totalPaid}_${newAmount}`);
                    return res.status(400).send("Total payment (previous + initial) exceeds new plan amount");
                }

                if (newInitialPayment > (newAmount - totalPaid)) {
                    log(`EXCEEDS_REMAINING_AMOUNT_${newInitialPayment}_${newAmount}_${totalPaid}`);
                    return res.status(400).send("Initial payment exceeds remaining amount for new plan");
                }

                if (requestedPaymentStatus === 'PARTIAL') {
                    if (newPendingAmount <= 0 || newPendingAmount >= newAmount) {
                        log(`INVALID_PARTIAL_STATUS_${newPendingAmount}_${newAmount}`);
                        return res.status(400).send("Pending amount must be between 0 and total amount for PARTIAL status");
                    }
                    if (newInitialPayment <= 0) {
                        log(`INVALID_PARTIAL_PAYMENT_${newInitialPayment}`);
                        return res.status(400).send("Initial payment must be greater than 0 for PARTIAL status");
                    }
                }

                if (requestedPaymentStatus === 'PENDING' && (totalPaid + newInitialPayment) > 0) {
                    log(`INVALID_PENDING_STATUS_${totalPaid}_${newInitialPayment}`);
                    return res.status(400).send("Total paid amount must be 0 for PENDING status");
                }

                newPaymentStatus = requestedPaymentStatus;

                // Record transaction for initial payment if provided
                if (newInitialPayment > 0) {
                    const currentBalance = await calculateBalanceFromTransactions(institute_id || existingTrainee.institute_id);
                    const newBalance = currentBalance + newInitialPayment;

                    const newTrans = new Transaction({
                        amt_in_out: "IN",
                        amount: newInitialPayment,
                        description: `PLAN_CHANGE_${name || existingTrainee.name}_${existingTrainee.roll_no}_${sportDetails?.name || 'UNKNOWN'}_${newPaymentStatus}`,
                        balance_before_transaction: currentBalance,
                        balance_after_transaction: newBalance,
                        method: method || 'CASH',
                        identification: transIdentification,
                        institute: institute_id || existingTrainee.institute_id,
                        institute_name: instituteDetails?.name || (await Institute.findById(existingTrainee.institute_id))?.name,
                        user: userId,
                        createdAt: new Date()
                    });
                    await newTrans.save();
                    log(`TRANSACTION_RECORDED_${existingTrainee.roll_no}_${newInitialPayment}`);
                }
            }
        }

        // Handle file uploads
        let photoFilename = existingTrainee.photo;
        let traineeSignatureFilename = existingTrainee.signature;
        let fatherSignatureFilename = existingTrainee.father_signature;

        if (req.files?.photo?.[0]) {
            const originalPath = req.files.photo[0].path;
            photoFilename = `${existingTrainee.roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, photoFilename));
        }
        if (req.files?.traineeSignature?.[0]) {
            const originalPath = req.files.traineeSignature[0].path;
            traineeSignatureFilename = `${existingTrainee.roll_no}_traineeSignature${path.extname(req.files.traineeSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, traineeSignatureFilename));
        }
        if (req.files?.fatherSignature?.[0]) {
            const originalPath = req.files.fatherSignature[0].path;
            fatherSignatureFilename = `${existingTrainee.roll_no}_fatherSignature${path.extname(req.files.fatherSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, fatherSignatureFilename));
        }

        // Update trainee fields
        existingTrainee.name = name || existingTrainee.name;
        existingTrainee.father = father || existingTrainee.father;
        existingTrainee.dob = dob || existingTrainee.dob;
        existingTrainee.address = address || existingTrainee.address;
        existingTrainee.phone = phone || existingTrainee.phone;
        existingTrainee.occupation = occupation || existingTrainee.occupation;
        existingTrainee.current_class = current_class || existingTrainee.current_class;
        existingTrainee.name_of_school = name_of_school || existingTrainee.name_of_school;
        existingTrainee.date_and_place = dateAndPlace || existingTrainee.date_and_place;
        existingTrainee.from = start_date || existingTrainee.from;
        existingTrainee.to = newExpiryDate;
        existingTrainee.photo = photoFilename || "";
        existingTrainee.signature = traineeSignatureFilename || "";
        existingTrainee.father_signature = fatherSignatureFilename || "";
        existingTrainee.sport_id = sport_id || existingTrainee.sport_id;
        existingTrainee.institute_id = institute_id || existingTrainee.institute_id;
        existingTrainee.plan_id = plan_id || existingTrainee.plan_id;
        existingTrainee.batch_id = batch_id || existingTrainee.batch_id;
        existingTrainee.session = session;
        existingTrainee.amount = newAmount;
        existingTrainee.pending_amount = newPendingAmount;
        existingTrainee.payment_status = newPaymentStatus;
        existingTrainee.method = method || existingTrainee.method;
        existingTrainee.trans_identification = transIdentification;

        await existingTrainee.save();
        log(`SUCCESSFULLY_UPDATED_TRAINEE_${traineeId}`);
        res.status(200).json({
            message: "Trainee updated successfully",
            trainee: existingTrainee,
            pending_amount: newPendingAmount
        });
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_${traineeId || 'UNKNOWN'}`);
        console.error('Error in /update-trainee:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Delete trainee
router.post("/delete-trainee", async (req, res) => {
    try {
        const { userid, id } = req.body;
        log(`DELETING_TRAINEE_${id}`);

        const result1 = await User.findById(userid);
        const trainee = await Academy.findById(id);
        if (!trainee) {
            log(`TRAINEE_NOT_FOUND_${id}`);
            return res.status(404).json("Trainee Not Found");
        }

        trainee.active = false;
        trainee.delete = true;
        await trainee.save();

        log(`SUCCESSFULLY_DELETED_TRAINEE_${id}`);
        return res.status(200).json("Trainee Deleted");
    } catch (error) {
        log(`ERROR_DELETING_TRAINEE_${id || 'UNKNOWN'}`);
        console.error('Error in /delete-trainee:', error);
        res.status(500).json({ message: "SERVER ERROR" });
    }
});

router.post("/fetch-trainee-transactions", async (req, res) => {
    try {
        const { trans_id } = req.body;
        const dt = await Transaction.find({ identification: trans_id });
        log(`SUCCESSFULLY FETCHED TRANSACTIONS FOR ${trans_id}`);
        return res.status(200).json({ message: dt });
    } catch (error) {
        log("Error In Fetching Transactions");
        res.status(500).json({ message: "SERVER ERROR" });
    }
});

module.exports = router;