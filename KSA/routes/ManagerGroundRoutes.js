// const express = require('express');
// const { getActivePlans ,getAllBookings, getAllPlans,getStaffAttendance,getUpcomingBookings,takeAttendance, getAttendance, updateTrainees,
//     newTrainee
// } = require('../controllers/ManagerGroundController');
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();
// const DetailsAcademy= require('../models/DetailsAcademy');
// const Academy= require('../models/Academy');
//
// const { log } = require("../Logs/logs")
// router.post('/all-plans', getAllPlans);
// router.post('/all-bookings', getAllBookings);
// const moment = require('moment');
// router.post('/take-attendance', takeAttendance);
// router.post('/trainee-attendance', getAttendance);
//
// router.post('/update-trainee-student', updateTrainees);
// router.post('/staff-attendance', getStaffAttendance);
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });
// const fs = require('fs');
// const bal_id = "677ba181a9f86714ba5b860b"
// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         // Ensure only expected file types are allowed (e.g., images)
//         const allowedTypes = /jpeg|jpg|png/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         if (extname) {
//             cb(null, true);
//         } else {
//             cb(new Error("Only images are allowed"));
//         }
//     },
// });
// const Balance = require("../models/Balance");
// const Transaction = require("../models/Transaction");
// const User = require("../models/user");
// router.post(
//     "/add-new-trainee",
//     upload.fields([
//         { name: "photo", maxCount: 1 },
//         { name: "traineeSignature", maxCount: 1 },
//         { name: "fatherSignature", maxCount: 1 },
//     ]),
//     async (req, res) => {
//         try {
//             const {
//                 name,
//                 payment_method,
//                 father,
//                 dob,
//                 address,
//                 phone,
//                 plan_id,
//                 amount,
//                 occupation,
//                 current_class,
//                 name_of_school,
//                 dateAndPlace,
//                 start_date,
//                 expiry_date
//             } = req.body;
//             log(`ADD_NEW_TRAINEE_${name}_${phone}`);
//             // Calculate roll_no based on total document count
//             const rollno = await Academy.countDocuments();
//             const roll_no = rollno + 20250001;
//
//             // Ensure plan exists
//             const planDetails = await DetailsAcademy.findById(plan_id);
//             if (!planDetails) return res.status(404).send("Plan not found");
//
//             const session = planDetails.name;
//             const plan_time = planDetails.plan_limit + " Days";
//             const today = moment();
//             const firstDate = today.add(1, "days");
//             const secondDate = moment(today).add(planDetails.plan_limit, "days");
//
//             // Assign filenames using roll_no for consistency
//             const photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0]?.originalname)}`;
//             const traineeSignatureFilename = `${roll_no}_traineeSignature${path.extname(req.files.traineeSignature[0]?.originalname)}`;
//             const fatherSignatureFilename = `${roll_no}_fatherSignature${path.extname(req.files.fatherSignature[0]?.originalname)}`;
//
//             // Rename uploaded files to match the format
//             fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
//             try{
//             fs.renameSync(req.files.traineeSignature[0]?.path, `uploads/${traineeSignatureFilename}`);
//             fs.renameSync(req.files.fatherSignature[0]?.path, `uploads/${fatherSignatureFilename}`);
//         }catch(error){
//             //console.log("pass")
//         }
//         //console.log("CONTINUE")
//             // Create new trainee entry
//             const newTrainee = new Academy({
//                 roll_no,
//                 name,
//                 father,
//                 dob,
//                 address,
//                 session,
//                 from: start_date,
//                 to: expiry_date,
//                 phone,
//                 plan_id,
//                 amount,
//                 occupation,
//                 current_class,
//                 name_of_school,
//                 date_and_place: dateAndPlace,
//                 photo: photoFilename,
//                 signature: traineeSignatureFilename||"",
//                 father_signature: fatherSignatureFilename||"",
//                 delete:false
//             });
//
//             // Balance and transaction handling
//             const balance1 = await Balance.findById(bal_id);
//             const bal = balance1.balance;
//
//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount: Number(amount)||0,
//                 description: "ACADEMY_NEW_" + roll_no,
//                 balance_before_transaction: bal,
//                 method: payment_method,
//                 balance_after_transaction: (Number(amount)||0) + Number(bal),
//                 identification: "ACADEMY_NEW_" + roll_no,
//             });
//
//             balance1.balance = (Number(amount) ||0)+ Number(bal);
//
//             // Save both trainee and transaction
//             await newTrainee.save();
//             await balance1.save();
//             await newTrans.save();
//
//             res.send("Trainee added successfully");
//         } catch (error) {
//             log(`ERROR_ADDING_TRAINEE`);
//             console.error(error);
//             res.status(500).send("Server error");
//         }
//     }
// );
//
// router.put(
//     "/update-trainee/:id",
//     upload.fields([
//         { name: "photo", maxCount: 1 },
//         { name: "traineeSignature", maxCount: 1 },
//         { name: "fatherSignature", maxCount: 1 },
//     ]),
//     async (req, res) => {
//         //console.log("Uploaded Files:", req.files);
//         log(`UPATING_TRAINEE_${req.params.id}`);
//         //console.log("*********************************************************************************************************************************************************************************************************")
//         try {
//             const traineeId = req.params.id;
//             const {
//                 name,
//                 father,
//                 dob,
//                 address,
//                 phone,
//                 occupation,
//                 current_class,
//                 name_of_school,
//                 start_date,
//                 expiry_date,
//                 dateAndPlace,
//             } = req.body;
//             //console.log(req.body)
//             // Find existing trainee
//             const existingTrainee = await Academy.findById(traineeId);
//             //console.log(1,"TRAINEE FETCHED")
//             if (!existingTrainee) return res.status(404).send("Trainee not found");
//             //console.log(2,"TRAINEE EXISTS")
//             // Check if plan exists
//             // Update file names if new files are uploaded
//             let photoFilename = existingTrainee.photo;
//             let traineeSignatureFilename = existingTrainee.signature;
//             let fatherSignatureFilename = existingTrainee.father_signature;
//             //console.log(3,"PHOTO FETCHED")
//             try {
//                 if (req.files?.photo?.[0]) {
//                     photoFilename = `${existingTrainee.roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
//                     fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
//                 }
//             } catch (error) {
//                 //console.log("Error renaming photo:", error);
//             }
//
//             try{
//                 if (req.files?.traineeSignature?.[0]) {
//                 traineeSignatureFilename = `${existingTrainee.roll_no}_traineeSignature${path.extname(req.files.traineeSignature[0]?.originalname)}`;
//                 fs.renameSync(req.files.traineeSignature[0]?.path, `uploads/${traineeSignatureFilename}`);
//             }
//             //console.log(5,"RENAME")
//         }catch (error){
//             //console.log(error)
//         }
//         try{
//             //console.log(6,"RENAME")
//             if (req.files?.fatherSignature?.[0]) {
//                 fatherSignatureFilename = `${existingTrainee.roll_no}_fatherSignature${path.extname(req.files.fatherSignature[0]?.originalname)}`;
//                 fs.renameSync(req.files.fatherSignature[0]?.path, `uploads/${fatherSignatureFilename}`);
//             }
//         }catch (error){
//                 //console.log(error)
//             }
//             //console.log(7,"ALL PHOTO RENAMED")
//             // Update trainee details
//             existingTrainee.name = name || existingTrainee.name;
//             existingTrainee.father = father || existingTrainee.father;
//             existingTrainee.dob = dob || existingTrainee.dob;
//             existingTrainee.address = address || existingTrainee.address;
//             existingTrainee.phone = phone || existingTrainee.phone;
//             existingTrainee.occupation = occupation || existingTrainee.occupation;
//             existingTrainee.current_class = current_class || existingTrainee.current_class;
//             existingTrainee.name_of_school = name_of_school || existingTrainee.name_of_school;
//             existingTrainee.date_and_place = dateAndPlace || existingTrainee.date_and_place;
//             existingTrainee.photo = photoFilename||"";
//             existingTrainee.signature = traineeSignatureFilename||"";
//             existingTrainee.father_signature = fatherSignatureFilename||"";
//             existingTrainee.from=start_date;
//             existingTrainee.to=expiry_date;
//             //console.log(8,"UPDATED BUT NOT SAVED")
//             // Handle balance update if amount is changed
//
//             await existingTrainee.save();
//             //console.log(9,"SUCCESS")
//             res.status(200).send("Trainee updated successfully");
//         } catch (error) {
//             log(`ERROR_UPDATING_TRAINEE`);
//             console.error(error);
//             res.status(500).send("Server error");
//         }
//     }
// );
//
//
// router.post("/delete-trainee",async (req,res)=>{
//     try{
//         const {userid,id}=req.body;
//     log(`DELETING_TRAINEE_${id}`);
//     const result1 = await User.findById(userid);
//     if (!result1) {
//         return res.status(400).json("Unauthenticated User");
//     }
//     const Trainee=await Academy.findById(id);
//     if (!Trainee){
//         return res.status(404).json("Trainee Not Found")
//     }
//     Trainee.active=false;
//     Trainee.delete=true;
//     await Trainee.save()
//     return res.status(200).json("Trainee Deleted");
// }
// catch(err){
//     log(`ERROR_DELETING_TRAINEE`);
//     //console.log(err);
//     return res.status(500).json({message:"SERVER ERROR"})
// }
// })
//
// module.exports = router;


const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const router = express.Router();

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
const { log } = require("../Logs/logs");

// Ensure uploads directory exists
const uploadDir = 'uploads/';
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

// Routes from controllers
router.post('/all-plans', (req, res, next) => {
    log(`ROUTING_ALL_PLANS`);
    getAllPlans(req, res, next);
});
router.post('/all-bookings', (req, res, next) => {
    log(`ROUTING_ALL_BOOKINGS`);
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

// Add new trainee with institute-based transactions
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
            name, payment_method, father, dob, address, phone,
            plan_id, sport_id, institute_id, amount, occupation,
            current_class, name_of_school, dateAndPlace, start_date, expiry_date
        } = req.body;
        log(`ADD_NEW_TRAINEE_${name}_${phone}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const rollno = await Academy.countDocuments();
        const roll_no = rollno + 20250001;

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
            amount,
            occupation,
            current_class,
            name_of_school,
            date_and_place: dateAndPlace,
            photo: photoFilename,
            signature: traineeSignatureFilename || "",
            father_signature: fatherSignatureFilename || "",
            delete: false
        });
        await newTrainee.save();

        if (amount && Number(amount) > 0) {
            const currentBalance = await calculateBalanceFromTransactions(institute_id);
            const newBalance = currentBalance + Number(amount);

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount: Number(amount),
                description: "ACADEMY_NEW_" + roll_no,
                balance_before_transaction: currentBalance,
                balance_after_transaction: newBalance,
                method: payment_method,
                identification: "ACADEMY_NEW_" + roll_no,
                institute: institute_id,
                institute_name: instituteDetails.name,
                user: userId
            });
            await newTrans.save();
            log(`TRANSACTION_RECORDED_${roll_no}_${amount}`);
        }

        log(`SUCCESSFULLY_ADDED_TRAINEE_${roll_no}`);
        res.send("Trainee and transaction added successfully!");
    } catch (error) {
        log(`ERROR_ADDING_TRAINEE_${name || 'UNKNOWN'}`);
        console.error('Error in /add-new-trainee:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Update trainee
router.put("/update-trainee/:id", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "traineeSignature", maxCount: 1 },
    { name: "fatherSignature", maxCount: 1 },
]), async (req, res) => {
    try {
        const traineeId = req.params.id;
        log(`UPDATING_TRAINEE_${traineeId}`);
        const {
            name, father, dob, address, phone, occupation,
            current_class, name_of_school, start_date, expiry_date, dateAndPlace
        } = req.body;

        const existingTrainee = await Academy.findById(traineeId);
        if (!existingTrainee) {
            log(`TRAINEE_NOT_FOUND_${traineeId}`);
            return res.status(404).send("Trainee not found");
        }

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

        existingTrainee.name = name || existingTrainee.name;
        existingTrainee.father = father || existingTrainee.father;
        existingTrainee.dob = dob || existingTrainee.dob;
        existingTrainee.address = address || existingTrainee.address;
        existingTrainee.phone = phone || existingTrainee.phone;
        existingTrainee.occupation = occupation || existingTrainee.occupation;
        existingTrainee.current_class = current_class || existingTrainee.current_class;
        existingTrainee.name_of_school = name_of_school || existingTrainee.name_of_school;
        existingTrainee.date_and_place = dateAndPlace || existingTrainee.date_and_place;
        existingTrainee.photo = photoFilename || "";
        existingTrainee.signature = traineeSignatureFilename || "";
        existingTrainee.father_signature = fatherSignatureFilename || "";
        existingTrainee.from = start_date || existingTrainee.from;
        existingTrainee.to = expiry_date || existingTrainee.to;

        await existingTrainee.save();
        log(`SUCCESSFULLY_UPDATED_TRAINEE_${traineeId}`);
        res.send("Trainee updated successfully");
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
        if (!result1) {
            log(`UNAUTHENTICATED_USER_${userid}`);
            return res.status(400).json("Unauthenticated User");
        }

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

module.exports = router;