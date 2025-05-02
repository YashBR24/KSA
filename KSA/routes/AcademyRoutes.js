// const express = require('express');
// const {
//     getActiveDetailsAcademy,
//     UpdatePlan,
//     getActivePlans,
//     getAllPlans,
//     getAllStudents,
//     AddPlan,
//     ChangePlanStatus,
//     addSport,
//     getAllSports,
//     getActiveSports,
//     changeSportStatus,
//     addInstitute,
//     getAllInstitutes,
//     getActiveInstitutes,
//     changeInstituteStatus,
//     editInstitute,
//     editSport,
//     deleteInstitute,
//     addBatch,
//     getAllBatches,
//     getActiveBatches,
//     editBatch,
//     changeBatchStatus,
//     deleteBatch,
//     getBatchesBySport
// } = require('../controllers/AcademyController');
// const mongoose = require('mongoose');
// const router = express.Router();
// const { log } = require('../Logs/logs');
// const Academy = require('../models/Academy');
// const Transaction = require('../models/Transaction');
// const Balance = require('../models/Balance');
// const DetailsAcademy = require('../models/DetailsAcademy');
// const Institute = require('../models/Institute');
// const Sport = require('../models/Sport');
// const User = require('../models/user');
// const Batch = require('../models/Batch');
// const moment = require('moment');
//
// // Helper function to generate random string
// function generateRandomString(length) {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * chars.length);
//         result += chars[randomIndex];
//     }
//     return result;
// }
//
// // Existing routes
// router.post('/active-plans', getActivePlans);
// router.post('/students', getAllStudents);
// router.post('/all-plans', getAllPlans);
// router.post('/add-plan', AddPlan);
// router.put('/update-plan/:id', UpdatePlan);
// router.patch('/update-plan-status/:id/toggle', ChangePlanStatus);
// router.get('/status', getActiveDetailsAcademy);
//
// router.post('/add-sport', addSport);
// router.post('/all-sports', getAllSports);
// router.post('/active-sports', getActiveSports);
// router.put('/update-sport/:id', editSport);
// router.patch('/update-sport-status/:id/toggle', changeSportStatus);
//
// router.post('/add-institute', addInstitute);
// router.post('/all-institutes', getAllInstitutes);
// router.post('/active-institutes', getActiveInstitutes);
// router.put('/update-institute/:id', editInstitute);
// router.patch('/update-institute-status/:id/toggle', changeInstituteStatus);
// router.delete('/institute/:id', deleteInstitute);
//
// router.post('/add-batch', addBatch);
// router.post('/all-batches', getAllBatches);
// router.post('/active-batches', getActiveBatches);
// router.put('/update-batch/:id', editBatch);
// router.patch('/update-batch-status/:id/toggle', changeBatchStatus);
// router.delete('/batch/:id', deleteBatch);
//
// // Get batches by sport
// router.get('/batches-by-sport/:sport_id', getBatchesBySport);
//
// // Add new trainee
// router.post('/trainee', async (req, res) => {
//     try {
//         log(`ADD_NEW_TRAINEE`);
//         const { sport_id, batch_id } = req.body;
//
//         // Validate sport and batch relationship
//         if (sport_id && batch_id) {
//             const batch = await Batch.findById(batch_id);
//             if (!batch) {
//                 return res.status(404).json({ error: 'Batch not found' });
//             }
//             if (batch.sport_id.toString() !== sport_id) {
//                 return res.status(400).json({ error: 'Selected batch does not belong to the selected sport' });
//             }
//         }
//
//         const trainee = new Academy({
//             ...req.body,
//             trans_identification: generateRandomString(10) // Generate trans_identification for new trainee
//         });
//         await trainee.save();
//         res.status(201).send(trainee);
//     } catch (error) {
//         log(`ERROR_ADDING_NEW_TRAINEE`);
//         res.status(400).send(error.message);
//     }
// });
//
// // Update trainee
// router.put('/trainee/:id', async (req, res) => {
//     try {
//         log(`UPDATING_TRAINEE_${req.params.id}`);
//         const { sport_id, batch_id } = req.body;
//
//         // Validate sport and batch relationship
//         if (sport_id && batch_id) {
//             const batch = await Batch.findById(batch_id);
//             if (!batch) {
//                 return res.status(404).json({ error: 'Batch not found' });
//             }
//             if (batch.sport_id.toString() !== sport_id) {
//                 return res.status(400).json({ error: 'Selected batch does not belong to the selected sport' });
//             }
//         }
//
//         const trainee = await Academy.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.send(trainee);
//     } catch (error) {
//         log(`ERROR_UPDATING_TRAINEE_${req.params.id}`);
//         res.status(400).send(error.message);
//     }
// });
//
// // Toggle trainee active status
// router.patch('/trainee/:id/toggle', async (req, res) => {
//     try {
//         log(`UPDATE_TRAINEE_STATUS_${req.params.id}`);
//         const trainee = await Academy.findById(req.params.id);
//         trainee.active = !trainee.active;
//         await trainee.save();
//         res.send(trainee);
//     } catch (error) {
//         log(`ERROR_UPDATING_TRAINEE_STATUS_${req.params.id}`);
//         res.status(400).send(error.message);
//     }
// });
//
// // Generate ID card
// router.post('/trainee/:id/generate-id', async (req, res) => {
//     try {
//         log(`GENERATED_ID_CARD_FOR_TRAINEE_${req.params.id}`);
//         const trainee = await Academy.findById(req.params.id);
//         trainee.id_card_generated = true;
//         await trainee.save();
//         res.send({ message: 'ID card generated successfully.' });
//     } catch (error) {
//         log(`ERROR_GENERATING_ID_CARD_${req.params.id}`);
//         res.status(400).send(error.message);
//     }
// });
//
// // Get all trainees
// router.get('/trainees', async (req, res) => {
//     try {
//         log(`FETCH_ALL_TRAINEES`);
//         const trainees = await Academy.find({ delete: false }).sort({ roll_no: 1 });
//         res.send(trainees);
//     } catch (error) {
//         log(`ERROR_FETCHING_TRAINEES_ALL`);
//         res.status(400).send(error.message);
//     }
// });
//
// router.post('/id-card-given', async (req, res) => {
//     try {
//         const { userid, id } = req.body;
//         log(`MARK_ID_CARD_GIVEN_${id}`);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(200).json("Not Found");
//         }
//         const trainee = await Academy.findById(id);
//         trainee.id_card_generated = true;
//         trainee.id_card_given = true;
//         await trainee.save();
//         return res.status(200).send("Trainee Updated successfully.");
//     } catch (error) {
//         log(`ERROR_MARKING_ID_CARD_AS_GIVEN_${id}`);
//         res.status(500).send("Server Error");
//     }
// });
//
// router.post('/id-card-generated', async (req, res) => {
//     try {
//         const { userid, id } = req.body;
//         log(`MARK_ID_CARD_GENERATED_${id}`);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(200).json("Not Found");
//         }
//         const trainee = await Academy.findById(id);
//         trainee.id_card_generated = true;
//         await trainee.save();
//         return res.status(200).send("Trainee Updated successfully.");
//     } catch (error) {
//         log(`ERROR_MARKING_ID_CARD_GENERATED_${id}`);
//         res.status(500).send("Server Error");
//     }
// });
//
// // Add partial payment for trainee
// router.post("/add-partial-payment", async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             log(`NO_AUTH_HEADER`);
//             return res.status(401).json({ message: "Authorization header missing" });
//         }
//
//         const userId = authHeader.split(' ')[1];
//         if (!userId) {
//             log(`NO_USER_ID_IN_AUTH`);
//             return res.status(401).json({ message: "User ID not provided in authorization" });
//         }
//
//         const { trainee_id, payment_amount, payment_method } = req.body;
//         log(`ADD_PARTIAL_PAYMENT_${trainee_id}_${payment_amount}`);
//
//         if (!trainee_id || !payment_amount || !payment_method) {
//             log(`MISSING_REQUIRED_FIELDS_PARTIAL_PAYMENT_${trainee_id || 'UNKNOWN'}`);
//             return res.status(400).send('Missing required fields');
//         }
//
//         if (!mongoose.Types.ObjectId.isValid(trainee_id)) {
//             log(`INVALID_ID_FORMAT_PARTIAL_PAYMENT_${trainee_id}`);
//             return res.status(400).send('Invalid trainee ID format');
//         }
//
//         const user = await User.findById(userId);
//         if (!user) {
//             log(`USER_NOT_FOUND_${userId}`);
//             return res.status(404).json({ message: "User Not Found" });
//         }
//
//         const trainee = await Academy.findById(trainee_id);
//         if (!trainee) {
//             log(`TRAINEE_NOT_FOUND_${trainee_id}`);
//             return res.status(404).send("Trainee not found");
//         }
//
//         if (trainee.payment_status === 'PAID') {
//             log(`ALREADY_FULLY_PAID_${trainee_id}`);
//             return res.status(400).send("Trainee has already paid in full");
//         }
//
//         const paymentAmount = Number(payment_amount);
//         if (paymentAmount <= 0 || isNaN(paymentAmount)) {
//             log(`INVALID_PAYMENT_AMOUNT_${payment_amount}`);
//             return res.status(400).send("Payment amount must be greater than 0");
//         }
//
//         if (paymentAmount > trainee.pending_amount) {
//             log(`EXCEEDS_PENDING_AMOUNT_${payment_amount}_${trainee.pending_amount}`);
//             return res.status(400).send("Payment amount exceeds pending amount");
//         }
//
//         const instituteDetails = await Institute.findById(trainee.institute_id);
//         if (!instituteDetails) {
//             log(`INSTITUTE_NOT_FOUND_${trainee.institute_id}`);
//             return res.status(404).send("Institute not found");
//         }
//
//         const sportDetails = await Sport.findById(trainee.sport_id);
//         if (!sportDetails) {
//             log(`SPORT_NOT_FOUND_${trainee.sport_id}`);
//             return res.status(404).send("Sport not found");
//         }
//
//         // Update trainee's pending amount and payment status
//         trainee.pending_amount -= paymentAmount;
//         trainee.payment_status = trainee.pending_amount === 0 ? 'PAID' : 'PARTIAL';
//         trainee.method = payment_method;
//         await trainee.save();
//
//         // Update balance
//         let balance = await Balance.findOne({ institute: trainee.institute_id });
//         if (!balance) {
//             balance = new Balance({
//                 institute: trainee.institute_id,
//                 balance: 0
//             });
//         }
//         const currentBalance = balance.balance;
//         balance.balance += paymentAmount;
//         await balance.save();
//
//         // Record transaction
//         const newTrans = new Transaction({
//             amt_in_out: "IN",
//             amount: paymentAmount,
//             description: `PARTIAL_PAYMENT_${trainee.name}_${trainee.roll_no}_${sportDetails.name}`,
//             balance_before_transaction: currentBalance,
//             balance_after_transaction: currentBalance + paymentAmount,
//             method: payment_method || 'CASH',
//             identification: trainee.trans_identification,
//             institute: trainee.institute_id,
//             institute_name: instituteDetails.name,
//             user: userId
//         });
//         await newTrans.save();
//         log(`TRANSACTION_RECORDED_${trainee.roll_no}_${payment_amount}`);
//
//         log(`SUCCESSFULLY_ADDED_PARTIAL_PAYMENT_${trainee_id}`);
//         res.status(200).json({
//             message: "Partial payment added successfully",
//             trainee,
//             pending_amount: trainee.pending_amount
//         });
//     } catch (error) {
//         log(`ERROR_ADDING_PARTIAL_PAYMENT_${req.body.trainee_id || 'UNKNOWN'}`);
//         console.error('Error in /add-partial-payment:', error);
//         res.status(500).send(`Server error: ${error.message}`);
//     }
// });
//
// // Renew trainee
// // router.post('/renewal', async (req, res) => {
// //     try {
// //         const authHeader = req.headers.authorization;
// //         if (!authHeader) {
// //             log(`NO_AUTH_HEADER_RENEWAL`);
// //             return res.status(401).json({ message: "Authorization header missing" });
// //         }
// //
// //         const userId = authHeader.split(' ')[1];
// //         if (!userId) {
// //             log(`NO_USER_ID_IN_AUTH_RENEWAL`);
// //             return res.status(401).json({ message: "User ID not provided in authorization" });
// //         }
// //
// //         const {
// //             trainee_id,
// //             name,
// //             roll_no,
// //             plan_id,
// //             amount,
// //             initial_payment,
// //             payment_status,
// //             payment_method,
// //             institute_id,
// //             sport_id,
// //             batch_id,
// //             start_date,
// //             expiry_date
// //         } = req.body;
// //
// //         if (!trainee_id || !plan_id || !amount || !payment_method || !institute_id || !sport_id || !batch_id || !roll_no) {
// //             log(`MISSING_REQUIRED_FIELDS_RENEWAL_${trainee_id || 'UNKNOWN'}`);
// //             return res.status(400).send('Missing required fields');
// //         }
// //
// //         if (!mongoose.Types.ObjectId.isValid(trainee_id) ||
// //             !mongoose.Types.ObjectId.isValid(plan_id) ||
// //             !mongoose.Types.ObjectId.isValid(institute_id) ||
// //             !mongoose.Types.ObjectId.isValid(sport_id) ||
// //             !mongoose.Types.ObjectId.isValid(batch_id)) {
// //             log(`INVALID_ID_FORMAT_RENEWAL_${trainee_id}`);
// //             return res.status(400).send('Invalid ID format');
// //         }
// //
// //         const trainee = await Academy.findById(trainee_id);
// //         if (!trainee) {
// //             log(`TRAINEE_NOT_FOUND_RENEWAL_${trainee_id}`);
// //             return res.status(404).send('Trainee not found');
// //         }
// //
// //         if (trainee.roll_no !== roll_no) {
// //             log(`INVALID_ROLL_NO_RENEWAL_${trainee_id}`);
// //             return res.status(400).send('Provided roll_no does not match trainee');
// //         }
// //
// //         const plan = await DetailsAcademy.findById(plan_id);
// //         if (!plan) {
// //             log(`PLAN_NOT_FOUND_RENEWAL_${trainee_id}`);
// //             return res.status(404).send('Plan not found');
// //         }
// //
// //         const institute = await Institute.findById(institute_id);
// //         if (!institute) {
// //             log(`INSTITUTE_NOT_FOUND_RENEWAL_${trainee_id}`);
// //             return res.status(404).send('Institute not found');
// //         }
// //
// //         const sport = await Sport.findById(sport_id);
// //         if (!sport) {
// //             log(`SPORT_NOT_FOUND_RENEWAL_${trainee_id}`);
// //             return res.status(404).send('Sport not found');
// //         }
// //
// //         const batch = await Batch.findById(batch_id);
// //         if (!batch) {
// //             log(`BATCH_NOT_FOUND_RENEWAL_${trainee_id}`);
// //             return res.status(404).send('Batch not found');
// //         }
// //
// //         // Validate that the batch belongs to the selected sport
// //         if (batch.sport_id.toString() !== sport_id) {
// //             log(`INVALID_BATCH_FOR_SPORT_RENEWAL_${trainee_id}`);
// //             return res.status(400).send('Selected batch does not belong to the selected sport');
// //         }
// //
// //         const user = await User.findById(userId);
// //         if (!user) {
// //             log(`USER_NOT_FOUND_${userId}`);
// //             return res.status(404).json({ message: "User Not Found" });
// //         }
// //
// //         let renewalStartDate = start_date ? moment(start_date) : moment();
// //         let renewalExpiryDate = expiry_date
// //             ? moment(expiry_date)
// //             : renewalStartDate.clone().add(plan.plan_limit, 'days');
// //
// //         if (!renewalStartDate.isValid() || !renewalExpiryDate.isValid()) {
// //             log(`INVALID_DATES_RENEWAL_${trainee_id}`);
// //             return res.status(400).send('Invalid date format');
// //         }
// //         if (renewalExpiryDate.isBefore(renewalStartDate)) {
// //             log(`EXPIRY_BEFORE_START_RENEWAL_${trainee_id}`);
// //             return res.status(400).send('Expiry date cannot be before start date');
// //         }
// //
// //         // Validate payment status and amounts
// //         const totalAmount = Number(amount) || 0;
// //         const initialPayment = Number(initial_payment) || 0;
// //         let pendingAmount = 0;
// //         let validatedPaymentStatus = payment_status?.toUpperCase() || 'PENDING';
// //
// //         if (!['PAID', 'PARTIAL', 'PENDING'].includes(validatedPaymentStatus)) {
// //             log(`INVALID_PAYMENT_STATUS_${validatedPaymentStatus}`);
// //             return res.status(400).send("Invalid payment status");
// //         }
// //
// //         if (validatedPaymentStatus === 'PAID' && initialPayment !== totalAmount) {
// //             log(`INVALID_PAID_AMOUNT_${initialPayment}_${totalAmount}`);
// //             return res.status(400).send("Initial payment must equal total amount for PAID status");
// //         }
// //
// //         if (validatedPaymentStatus === 'PARTIAL') {
// //             if (initialPayment >= totalAmount || initialPayment <= 0) {
// //                 log(`INVALID_PARTIAL_AMOUNT_${initialPayment}_${totalAmount}`);
// //                 return res.status(400).send("Initial payment must be less than total amount and greater than 0 for PARTIAL status");
// //             }
// //             pendingAmount = totalAmount - initialPayment;
// //         }
// //
// //         if (validatedPaymentStatus === 'PENDING') {
// //             if (initialPayment > 0) {
// //                 log(`INVALID_PENDING_AMOUNT_${initialPayment}`);
// //                 return res.status(400).send("Initial payment must be 0 for PENDING status");
// //             }
// //             pendingAmount = totalAmount;
// //         }
// //
// //         // Generate new trans_identification for renewal
// //         const newTransIdentification = generateRandomString(10);
// //
// //         // Update trainee details
// //         trainee.plan_id = plan_id;
// //         trainee.institute_id = institute_id;
// //         trainee.sport_id = sport_id;
// //         trainee.batch_id = batch_id;
// //         trainee.from = renewalStartDate.toDate();
// //         trainee.to = renewalExpiryDate.toDate();
// //         trainee.amount = totalAmount;
// //         trainee.session = plan.name;
// //         trainee.active = true;
// //         trainee.trans_identification = newTransIdentification;
// //         trainee.payment_status = validatedPaymentStatus;
// //         trainee.pending_amount = pendingAmount;
// //         trainee.method = payment_method;
// //         await trainee.save();
// //
// //
// //         // Update balance
// //         let balance = await Balance.findOne({ institute: institute_id });
// //         if (!balance) {
// //             balance = new Balance({
// //                 institute: institute_id,
// //                 balance: 0
// //             });
// //         }
// //         const currentBalance = balance.balance;
// //
// //         // Record transaction if there is an initial payment
// //         if (initialPayment > 0) {
// //             const transaction = new Transaction({
// //                 amt_in_out: 'IN',
// //                 amount: initialPayment,
// //                 description: `ACADEMY_RENEWAL_${name}_${roll_no}_${sport.name}_${validatedPaymentStatus}`,
// //                 balance_before_transaction: currentBalance,
// //                 balance_after_transaction: currentBalance + initialPayment,
// //                 method: payment_method,
// //                 identification: newTransIdentification,
// //                 institute: institute_id,
// //                 institute_name: institute.name,
// //                 user: userId
// //             });
// //             await transaction.save();
// //
// //             balance.balance += initialPayment;
// //             await balance.save();
// //         }
// //
// //         log(`RENEWED_TRAINEE_SUCCESSFULLY_${trainee_id}`);
// //         res.status(200).send({
// //             message: 'Successfully renewed',
// //             trainee,
// //             pending_amount: pendingAmount
// //         });
// //     } catch (error) {
// //         const errorLogId = req.body.trainee_id || 'UNKNOWN';
// //         log(`ERROR_IN_TRAINEE_RENEWAL_${errorLogId}: ${error.message}`);
// //         console.error('Renewal error:', error);
// //         res.status(500).send('Server error');
// //     }
// // });
//
// router.post('/renewal', async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             log(`NO_AUTH_HEADER_RENEWAL`);
//             return res.status(401).json({ message: "Authorization header missing" });
//         }
//
//         const userId = authHeader.split(' ')[1];
//         if (!userId) {
//             log(`NO_USER_ID_IN_AUTH_RENEWAL`);
//             return res.status(401).json({ message: "User ID not provided in authorization" });
//         }
//
//         const {
//             trainee_id,
//             name,
//             roll_no,
//             plan_id,
//             amount,
//             initial_payment,
//             payment_status,
//             method,
//             institute_id,
//             sport_id,
//             batch_id,
//             start_date,
//             expiry_date
//         } = req.body;
//
//         // Check for missing required fields
//         const missingFields = [];
//         if (!trainee_id) missingFields.push('trainee_id');
//         if (!plan_id) missingFields.push('plan_id');
//         if (!amount) missingFields.push('amount');
//         if (!institute_id) missingFields.push('institute_id');
//         if (!sport_id) missingFields.push('sport_id');
//         if (!batch_id) missingFields.push('batch_id');
//         if (!roll_no) missingFields.push('roll_no');
//         if (!method) missingFields.push('method');
//
//         if (missingFields.length > 0) {
//             log(`MISSING_FIELDS_RENEWAL_${trainee_id || 'UNKNOWN'}: ${missingFields.join(', ')}`);
//             return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
//         }
//
//         // Validate IDs
//         if (!mongoose.Types.ObjectId.isValid(trainee_id) ||
//             !mongoose.Types.ObjectId.isValid(plan_id) ||
//             !mongoose.Types.ObjectId.isValid(institute_id) ||
//             !mongoose.Types.ObjectId.isValid(sport_id) ||
//             !mongoose.Types.ObjectId.isValid(batch_id)) {
//             log(`INVALID_ID_FORMAT_RENEWAL_${trainee_id}`);
//             return res.status(400).send('Invalid ID format');
//         }
//
//         const trainee = await Academy.findById(trainee_id);
//         if (!trainee) {
//             log(`TRAINEE_NOT_FOUND_RENEWAL_${trainee_id}`);
//             return res.status(404).send('Trainee not found');
//         }
//
//         if (trainee.roll_no !== roll_no) {
//             log(`INVALID_ROLL_NO_RENEWAL_${trainee_id}`);
//             return res.status(400).send('Provided roll_no does not match trainee');
//         }
//
//         const plan = await DetailsAcademy.findById(plan_id);
//         if (!plan) {
//             log(`PLAN_NOT_FOUND_RENEWAL_${trainee_id}`);
//             return res.status(404).send('Plan not found');
//         }
//
//         const institute = await Institute.findById(institute_id);
//         if (!institute) {
//             log(`INSTITUTE_NOT_FOUND_RENEWAL_${trainee_id}`);
//             return res.status(404).send('Institute not found');
//         }
//
//         const sport = await Sport.findById(sport_id);
//         if (!sport) {
//             log(`SPORT_NOT_FOUND_RENEWAL_${trainee_id}`);
//             return res.status(404).send('Sport not found');
//         }
//
//         const batch = await Batch.findById(batch_id);
//         if (!batch) {
//             log(`BATCH_NOT_FOUND_RENEWAL_${trainee_id}`);
//             return res.status(404).send('Batch not found');
//         }
//
//         if (batch.sport_id.toString() !== sport_id) {
//             log(`INVALID_BATCH_FOR_SPORT_RENEWAL_${trainee_id}`);
//             return res.status(400).send('Selected batch does not belong to the selected sport');
//         }
//
//         const user = await User.findById(userId);
//         if (!user) {
//             log(`USER_NOT_FOUND_${userId}`);
//             return res.status(404).json({ message: "User Not Found" });
//         }
//
//         let renewalStartDate = start_date ? moment(start_date) : moment();
//         let renewalExpiryDate = expiry_date
//             ? moment(expiry_date)
//             : renewalStartDate.clone().add(plan.plan_limit, 'days');
//
//         if (!renewalStartDate.isValid() || !renewalExpiryDate.isValid()) {
//             log(`INVALID_DATES_RENEWAL_${trainee_id}`);
//             return res.status(400).send('Invalid date format');
//         }
//         if (renewalExpiryDate.isBefore(renewalStartDate)) {
//             log(`EXPIRY_BEFORE_START_RENEWAL_${trainee_id}`);
//             return res.status(400).send('Expiry date cannot be before start date');
//         }
//
//         const totalAmount = Number(amount) || 0;
//         const initialPayment = Number(initial_payment) || 0;
//         let pendingAmount = 0; // Fixed syntax error
//         let validatedPaymentStatus = payment_status?.toUpperCase() || 'PENDING';
//
//         if (!['PAID', 'PARTIAL', 'PENDING'].includes(validatedPaymentStatus)) {
//             log(`INVALID_PAYMENT_STATUS_${validatedPaymentStatus}`);
//             return res.status(400).send("Invalid payment status");
//         }
//
//         if (validatedPaymentStatus === 'PAID' && initialPayment !== totalAmount) {
//             log(`INVALID_PAID_AMOUNT_${initialPayment}_${totalAmount}`);
//             return res.status(400).send("Initial payment must equal total amount for PAID status");
//         }
//
//         if (validatedPaymentStatus === 'PARTIAL') {
//             if (initialPayment >= totalAmount || initialPayment <= 0) {
//                 log(`INVALID_PARTIAL_AMOUNT_${initialPayment}_${totalAmount}`);
//                 return res.status(400).send("Initial payment must be less than total amount and greater than 0 for PARTIAL status");
//             }
//             pendingAmount = totalAmount - initialPayment;
//         }
//
//         if (validatedPaymentStatus === 'PENDING') {
//             if (initialPayment > 0) {
//                 log(`INVALID_PENDING_AMOUNT_${initialPayment}`);
//                 return res.status(400).send("Initial payment must be 0 for PENDING status");
//             }
//             pendingAmount = totalAmount;
//         }
//
//         const newTransIdentification = generateRandomString(10);
//
//         trainee.plan_id = plan_id;
//         trainee.institute_id = institute_id;
//         trainee.sport_id = sport_id;
//         trainee.batch_id = batch_id;
//         trainee.from = renewalStartDate.toDate();
//         trainee.to = renewalExpiryDate.toDate();
//         trainee.amount = totalAmount;
//         trainee.session = plan.name;
//         trainee.active = true;
//         trainee.trans_identification = newTransIdentification;
//         trainee.payment_status = validatedPaymentStatus;
//         trainee.pending_amount = pendingAmount;
//         trainee.method = method ;
//         await trainee.save();
//
//         let balance = await Balance.findOne({ institute: institute_id });
//         if (!balance) {
//             balance = new Balance({
//                 institute: institute_id,
//                 balance: 0
//             });
//         }
//         const currentBalance = balance.balance;
//
//         if (initialPayment > 0) {
//             const transaction = new Transaction({
//                 amt_in_out: 'IN',
//                 amount: initialPayment,
//                 description: `ACADEMY_RENEWAL_${name}_${roll_no}_${sport.name}_${validatedPaymentStatus}`,
//                 balance_before_transaction: currentBalance,
//                 balance_after_transaction: currentBalance + initialPayment,
//                 method: method || 'CASH',
//                 identification: newTransIdentification,
//                 institute: institute_id,
//                 institute_name: institute.name,
//                 user: userId
//             });
//             await transaction.save();
//
//             balance.balance += initialPayment;
//             await balance.save();
//         }
//
//         log(`RENEWED_TRAINEE_SUCCESSFULLY_${trainee_id}`);
//         res.status(200).send({
//             message: 'Successfully renewed',
//             trainee,
//             pending_amount: pendingAmount
//         });
//     } catch (error) {
//         const errorLogId = req.body.trainee_id || 'UNKNOWN';
//         log(`ERROR_IN_TRAINEE_RENEWAL_${errorLogId}: ${error.message}`);
//         console.error('Renewal error:', error);
//         res.status(500).send('Server error');
//     }
// });
//
// module.exports = router;



const express = require('express');
const {
    getActiveDetailsAcademy,
    UpdatePlan,
    getActivePlans,
    getAllPlans,
    getAllStudents,
    AddPlan,
    ChangePlanStatus,
    addSport,
    getAllSports,
    getActiveSports,
    changeSportStatus,
    addInstitute,
    getAllInstitutes,
    getActiveInstitutes,
    changeInstituteStatus,
    editInstitute,
    editSport,
    deleteInstitute,
    addBatch,
    getAllBatches,
    getActiveBatches,
    editBatch,
    changeBatchStatus,
    deleteBatch,
    getBatchesBySport
} = require('../controllers/AcademyController');
const mongoose = require('mongoose');
const router = express.Router();
const { log } = require('../Logs/logs');
const Academy = require('../models/Academy');
const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');
const DetailsAcademy = require('../models/DetailsAcademy');
const Institute = require('../models/Institute');
const Sport = require('../models/Sport');
const User = require('../models/user');
const Batch = require('../models/Batch');
const moment = require('moment');

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

// Existing routes
router.post('/active-plans', getActivePlans);
router.post('/students', getAllStudents);
router.post('/all-plans', getAllPlans);
router.post('/add-plan', AddPlan);
router.put('/update-plan/:id', UpdatePlan);
router.patch('/update-plan-status/:id/toggle', ChangePlanStatus);
router.get('/status', getActiveDetailsAcademy);

router.post('/add-sport', addSport);
router.post('/all-sports', getAllSports);
router.post('/active-sports', getActiveSports);
router.put('/update-sport/:id', editSport);
router.patch('/update-sport-status/:id/toggle', changeSportStatus);

router.post('/add-institute', addInstitute);
router.post('/all-institutes', getAllInstitutes);
router.post('/active-institutes', getActiveInstitutes);
router.put('/update-institute/:id', editInstitute);
router.patch('/update-institute-status/:id/toggle', changeInstituteStatus);
router.delete('/institute/:id', deleteInstitute);

router.post('/add-batch', addBatch);
router.post('/all-batches', getAllBatches);
router.post('/active-batches', getActiveBatches);
router.put('/update-batch/:id', editBatch);
router.patch('/update-batch-status/:id/toggle', changeBatchStatus);
router.delete('/batch/:id', deleteBatch);

// Get batches by sport
router.get('/batches-by-sport/:sport_id', getBatchesBySport);

// Add new trainee
router.post('/trainee', async (req, res) => {
    try {
        log(`ADD_NEW_TRAINEE`);
        const { sport_id, batch_id } = req.body;

        // Validate sport and batch relationship
        if (sport_id && batch_id) {
            const batch = await Batch.findById(batch_id);
            if (!batch) {
                return res.status(404).json({ error: 'Batch not found' });
            }
            if (batch.sport_id.toString() !== sport_id) {
                return res.status(400).json({ error: 'Selected batch does not belong to the selected sport' });
            }
        }

        const trainee = new Academy({
            ...req.body,
            trans_identification: generateRandomString(10) // Generate trans_identification for new trainee
        });
        await trainee.save();
        res.status(201).send(trainee);
    } catch (error) {
        log(`ERROR_ADDING_NEW_TRAINEE`);
        res.status(400).send(error.message);
    }
});

// Update trainee
router.put('/trainee/:id', async (req, res) => {
    try {
        log(`UPDATING_TRAINEE_${req.params.id}`);
        const { sport_id, batch_id } = req.body;

        // Validate sport and batch relationship
        if (sport_id && batch_id) {
            const batch = await Batch.findById(batch_id);
            if (!batch) {
                return res.status(404).json({ error: 'Batch not found' });
            }
            if (batch.sport_id.toString() !== sport_id) {
                return res.status(400).json({ error: 'Selected batch does not belong to the selected sport' });
            }
        }

        const trainee = await Academy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(trainee);
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_${req.params.id}`);
        res.status(400).send(error.message);
    }
});

// Toggle trainee active status
router.patch('/trainee/:id/toggle', async (req, res) => {
    try {
        log(`UPDATE_TRAINEE_STATUS_${req.params.id}`);
        const trainee = await Academy.findById(req.params.id);
        trainee.active = !trainee.active;
        await trainee.save();
        res.send(trainee);
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_STATUS_${req.params.id}`);
        res.status(400).send(error.message);
    }
});

// Generate ID card
router.post('/trainee/:id/generate-id', async (req, res) => {
    try {
        log(`GENERATED_ID_CARD_FOR_TRAINEE_${req.params.id}`);
        const trainee = await Academy.findById(req.params.id);
        trainee.id_card_generated = true;
        await trainee.save();
        res.send({ message: 'ID card generated successfully.' });
    } catch (error) {
        log(`ERROR_GENERATING_ID_CARD_${req.params.id}`);
        res.status(400).send(error.message);
    }
});

// Get all trainees with their transactions
router.get('/trainees', async (req, res) => {
    try {
        log(`FETCH_ALL_TRAINEES_WITH_TRANSACTIONS`);
        // Fetch all trainees where delete is false
        const trainees = await Academy.find({ delete: false })
            .sort({ roll_no: 1 })
            .lean(); // Use lean() for better performance as we don't need Mongoose documents

        // Get all trans_identification values from trainees
        const transIdentifications = trainees
            .filter(trainee => trainee.trans_identification)
            .map(trainee => trainee.trans_identification);

        // Fetch all relevant transactions in one query
        const transactions = await Transaction.find({
            identification: { $in: transIdentifications },
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('institute', 'name')
            .lean();

        // Map transactions to trainees
        const traineesWithTransactions = trainees.map(trainee => {
            const traineeTransactions = transactions.filter(
                transaction => transaction.identification === trainee.trans_identification
            );
            return {
                ...trainee,
                transactions: traineeTransactions
            };
        });

        log(`FETCHED_${traineesWithTransactions.length}_TRAINEES_WITH_TRANSACTIONS`);
        res.send(traineesWithTransactions);
    } catch (error) {
        log(`ERROR_FETCHING_TRAINEES_WITH_TRANSACTIONS: ${error.message}`);
        res.status(400).send(error.message);
    }
});

router.post('/id-card-given', async (req, res) => {
    try {
        const { userid, id } = req.body;
        log(`MARK_ID_CARD_GIVEN_${id}`);
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const trainee = await Academy.findById(id);
        trainee.id_card_generated = true;
        trainee.id_card_given = true;
        await trainee.save();
        return res.status(200).send("Trainee Updated successfully.");
    } catch (error) {
        log(`ERROR_MARKING_ID_CARD_AS_GIVEN_${id}`);
        res.status(500).send("Server Error");
    }
});

router.post('/id-card-generated', async (req, res) => {
    try {
        const { userid, id } = req.body;
        log(`MARK_ID_CARD_GENERATED_${id}`);
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const trainee = await Academy.findById(id);
        trainee.id_card_generated = true;
        await trainee.save();
        return res.status(200).send("Trainee Updated successfully.");
    } catch (error) {
        log(`ERROR_MARKING_ID_CARD_GENERATED_${id}`);
        res.status(500).send("Server Error");
    }
});

// Add partial payment for trainee
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

        if (!trainee_id || !payment_amount || !payment_method) {
            log(`MISSING_REQUIRED_FIELDS_PARTIAL_PAYMENT_${trainee_id || 'UNKNOWN'}`);
            return res.status(400).send('Missing required fields');
        }

        if (!mongoose.Types.ObjectId.isValid(trainee_id)) {
            log(`INVALID_ID_FORMAT_PARTIAL_PAYMENT_${trainee_id}`);
            return res.status(400).send('Invalid trainee ID format');
        }

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

        // Update balance
        let balance = await Balance.findOne({ institute: trainee.institute_id });
        if (!balance) {
            balance = new Balance({
                institute: trainee.institute_id,
                balance: 0
            });
        }
        const currentBalance = balance.balance;
        balance.balance += paymentAmount;
        await balance.save();

        // Record transaction
        const newTrans = new Transaction({
            amt_in_out: "IN",
            amount: paymentAmount,
            description: `PARTIAL_PAYMENT_${trainee.name}_${trainee.roll_no}_${sportDetails.name}`,
            balance_before_transaction: currentBalance,
            balance_after_transaction: currentBalance + paymentAmount,
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
        log(`ERROR_ADDING_PARTIAL_PAYMENT_${req.body.trainee_id || 'UNKNOWN'}`);
        console.error('Error in /add-partial-payment:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Renew trainee
router.post('/renewal', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            log(`NO_AUTH_HEADER_RENEWAL`);
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const userId = authHeader.split(' ')[1];
        if (!userId) {
            log(`NO_USER_ID_IN_AUTH_RENEWAL`);
            return res.status(401).json({ message: "User ID not provided in authorization" });
        }

        const {
            trainee_id,
            name,
            roll_no,
            plan_id,
            amount,
            initial_payment,
            payment_status,
            method,
            institute_id,
            sport_id,
            batch_id,
            start_date,
            expiry_date
        } = req.body;

        // Check for missing required fields
        const missingFields = [];
        if (!trainee_id) missingFields.push('trainee_id');
        if (!plan_id) missingFields.push('plan_id');
        if (!amount) missingFields.push('amount');
        if (!institute_id) missingFields.push('institute_id');
        if (!sport_id) missingFields.push('sport_id');
        if (!batch_id) missingFields.push('batch_id');
        if (!roll_no) missingFields.push('roll_no');
        if (!method) missingFields.push('method');

        if (missingFields.length > 0) {
            log(`MISSING_FIELDS_RENEWAL_${trainee_id || 'UNKNOWN'}: ${missingFields.join(', ')}`);
            return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(trainee_id) ||
            !mongoose.Types.ObjectId.isValid(plan_id) ||
            !mongoose.Types.ObjectId.isValid(institute_id) ||
            !mongoose.Types.ObjectId.isValid(sport_id) ||
            !mongoose.Types.ObjectId.isValid(batch_id)) {
            log(`INVALID_ID_FORMAT_RENEWAL_${trainee_id}`);
            return res.status(400).send('Invalid ID format');
        }

        const trainee = await Academy.findById(trainee_id);
        if (!trainee) {
            log(`TRAINEE_NOT_FOUND_RENEWAL_${trainee_id}`);
            return res.status(404).send('Trainee not found');
        }

        if (trainee.roll_no !== roll_no) {
            log(`INVALID_ROLL_NO_RENEWAL_${trainee_id}`);
            return res.status(400).send('Provided roll_no does not match trainee');
        }

        const plan = await DetailsAcademy.findById(plan_id);
        if (!plan) {
            log(`PLAN_NOT_FOUND_RENEWAL_${trainee_id}`);
            return res.status(404).send('Plan not found');
        }

        const institute = await Institute.findById(institute_id);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_RENEWAL_${trainee_id}`);
            return res.status(404).send('Institute not found');
        }

        const sport = await Sport.findById(sport_id);
        if (!sport) {
            log(`SPORT_NOT_FOUND_RENEWAL_${trainee_id}`);
            return res.status(404).send('Sport not found');
        }

        const batch = await Batch.findById(batch_id);
        if (!batch) {
            log(`BATCH_NOT_FOUND_RENEWAL_${trainee_id}`);
            return res.status(404).send('Batch not found');
        }

        if (batch.sport_id.toString() !== sport_id) {
            log(`INVALID_BATCH_FOR_SPORT_RENEWAL_${trainee_id}`);
            return res.status(400).send('Selected batch does not belong to the selected sport');
        }

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        let renewalStartDate = start_date ? moment(start_date) : moment();
        let renewalExpiryDate = expiry_date
            ? moment(expiry_date)
            : renewalStartDate.clone().add(plan.plan_limit, 'days');

        if (!renewalStartDate.isValid() || !renewalExpiryDate.isValid()) {
            log(`INVALID_DATES_RENEWAL_${trainee_id}`);
            return res.status(400).send('Invalid date format');
        }
        if (renewalExpiryDate.isBefore(renewalStartDate)) {
            log(`EXPIRY_BEFORE_START_RENEWAL_${trainee_id}`);
            return res.status(400).send('Expiry date cannot be before start date');
        }

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

        const newTransIdentification = generateRandomString(10);

        trainee.plan_id = plan_id;
        trainee.institute_id = institute_id;
        trainee.sport_id = sport_id;
        trainee.batch_id = batch_id;
        trainee.from = renewalStartDate.toDate();
        trainee.to = renewalExpiryDate.toDate();
        trainee.amount = totalAmount;
        trainee.session = plan.name;
        trainee.active = true;
        trainee.trans_identification = newTransIdentification;
        trainee.payment_status = validatedPaymentStatus;
        trainee.pending_amount = pendingAmount;
        trainee.method = method;
        await trainee.save();

        let balance = await Balance.findOne({ institute: institute_id });
        if (!balance) {
            balance = new Balance({
                institute: institute_id,
                balance: 0
            });
        }
        const currentBalance = balance.balance;

        if (initialPayment > 0) {
            const transaction = new Transaction({
                amt_in_out: 'IN',
                amount: initialPayment,
                description: `ACADEMY_RENEWAL_${name}_${roll_no}_${sport.name}_${validatedPaymentStatus}`,
                balance_before_transaction: currentBalance,
                balance_after_transaction: currentBalance + initialPayment,
                method: method || 'CASH',
                identification: newTransIdentification,
                institute: institute_id,
                institute_name: institute.name,
                user: userId
            });
            await transaction.save();

            balance.balance += initialPayment;
            await balance.save();
        }

        log(`RENEWED_TRAINEE_SUCCESSFULLY_${trainee_id}`);
        res.status(200).send({
            message: 'Successfully renewed',
            trainee,
            pending_amount: pendingAmount
        });
    } catch (error) {
        const errorLogId = req.body.trainee_id || 'UNKNOWN';
        log(`ERROR_IN_TRAINEE_RENEWAL_${errorLogId}: ${error.message}`);
        console.error('Renewal error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;