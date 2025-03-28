// const DetailsTG = require('../models/DetailsTurfGround');
// const DetailsAcademy = require('../models/DetailsAcademy');
// const Status = require('../models/Status');
// const CryptoJS = require('crypto-js');
// const GroundBooking = require('../models/Ground');
// const Ground = require('../models/Ground');
// const User = require("../models/user");
// const Attendance = require("../models/Attendance");
// const { log } = require("../Logs/logs")
// const Academy = require("../models/Academy");
// const Transaction = require("../models/Transaction");
// const Balance = require("../models/Balance");
// const StaffAttendance = require("../models/StaffAttendance")
// const Staff = require("../models/Staff")
// const getActivePlans = async (req, res) => {
//     try {
//         log(`FETCH_ACTIVE_GROUND_PLANS`);
//         // Fetch details with specific fields to return
//         const result = await DetailsTG.find({
//             active: true,
//             $or: [{
//                 category: 'GROUND-A'
//             }, {
//                 category: 'GROUND-B'
//             }]
//         }, {
//             _id: 1,
//             name: 1,
//             amount: 1,
//             time_hr: 1,
//             time_min: 1,
//             category: 1,
//             sport: 1,
//             from: 1,
//             to: 1
//         });
//
//         res.status(200).json(result);
//     } catch (error) {
//         log(`ERROR_FETCHING_GROUND_PLANS`);
//         console.error('Error fetching default price:', error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };
//
// const getUpcomingBookings = async (req, res) => {
//     try {
//         const currentDate = new Date();
//         log(`FETCHING_GROUND_UPCOMING_BOOKINGS`);
//         // Fetch only selected fields: `_id`, `name`, `booked_by`, `start_date`, `end_date`
//         const bookings = await GroundBooking.find({
//             start_date: {
//                 $gt: currentDate
//             },
//             status: true
//         }).select('start_date end_date');
//
//         res.status(200).json(bookings);
//     } catch (error) {
//         log(`ERROR_FETCHING_GROUND_UPCOMING_BOOKINGS`);
//         console.error('Error fetching upcoming bookings:', error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };
//
// const getAllBookings = async (req, res) => {
//     try {
//         log(`FETCH_ALL_GROUND_BOOKING`);
//         const {
//             userId
//         } = req.body;
//         const result1 = await User.findById(userId);
//         if (!result1 || result1.role!=="Manager") {
//             return res.status(200).json("Not Found");
//         }
//         const bookings = await GroundBooking.find({status:true});
//         res.status(200).json(bookings);
//     } catch (error) {
//         log(`ERROR_FETCHING_ALL_BOOKINGS`);
//         console.error('Error fetching upcoming bookings:', error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };
//
// const getAllPlans = async (req, res) => {
//     try {
//         const {
//             userId
//         } = req.body;
//         log(`FETCHING_ALL_GROUND_PLANS`);
//         const result1 = await User.findById(userId);
//         if (!result1) {
//             return res.status(200).json("Not Found");
//         }
//         // Fetch details with specific fields to return
//         const result = await DetailsTG.find({
//             $or: [{
//                 category: 'GROUND-A'
//             }, {
//                 category: 'GROUND-B'
//             }]
//         }, {
//             _id: 1,
//             name: 1,
//             amount: 1,
//             time_hr: 1,
//             time_min: 1,
//             category: 1,
//             sport: 1,
//             from: 1,
//             to: 1,
//             active: 1
//         });
//
//         res.status(200).json(result);
//     } catch (error) {
//         log(`ERROR_FETCHING_GROUND_PLANS`);
//         console.error('Error fetching default price:', error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };
//
// const changeStatus = async (req, res) => {
//     try {
//         const {
//             status
//         } = req.body; // status can be 'active', 'ended', 'inactive'
//         log(`CHANGE_GROUND_ID_STATUS_${req.params.id}`);
//         const updatedBooking = await Ground.findByIdAndUpdate(req.params.id, {
//             status
//         }, {
//             new: true
//         });
//
//         res.json({
//             message: 'Booking status updated.',
//             updatedBooking
//         });
//     } catch (error) {
//         log(`ERROR_CHANGING_GROUND_STATUS`);
//         res.status(500).json({
//             message: 'Error updating booking status.'
//         });
//     }
// }
//
// // const updateBooking = async (req, res) => {
// //     try {
// //         const {
// //             name,
// //             mobile_no,
// //             booked_by,
// //             date,
// //             amount,
// //             ground,
// //             payment_status,
// //             plan_id,
// //             payment_method,
// //             status,
// //             description,
// //             advance,
// //             advpaymentmode,
// //             started,
// //             ended,
// //         } = req.body;
// //         const updatedBooking = await Ground.findByIdAndUpdate(
// //             req.params.id, {
// //                 name,
// //                 mobile_no,
// //                 leftover: amount - advance,
// //                 booked_by,
// //                 date,
// //                 amount,
// //                 ground,
// //                 payment_status,
// //                 plan_id,
// //                 payment_method,
// //                 status,
// //                 description,
// //                 advance,
// //                 advpaymentmode,
// //                 started,
// //                 ended,
// //             }, {
// //                 new: true
// //             }
// //         );
//
// //         res.json({
// //             message: 'Booking details updated.',
// //             updatedBooking
// //         });
// //     } catch (error) {
// //         res.status(500).json({
// //             message: 'Error updating booking details.'
// //         });
// //     }
// // }
//
// const updateBooking = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {
//             amount,
//             advance,
//             description,
//             ended,
//             started,
//             status,
//             name,
//             mobile_no
//         } = req.body;
//         log(`UPDATING_GROUND_BOOOKING_${id}`);
//         // Find existing booking
//         const existingBooking = await Ground.findById(id);
//         if (!existingBooking) {
//             return res.status(404).json({ message: "Booking not found." });
//         }
//
//         // Calculate leftover dynamically if amount is changed
//         let updatedLeftover = existingBooking.leftover;
//         if (amount !== undefined && Number(amount) !== Number(existingBooking.amount)) {
//             const paidAmount = Number(existingBooking.amount) - Number(existingBooking.leftover);
//             updatedLeftover = Math.max(Number(amount) - paidAmount, 0);
//         }
//
//         // Prepare update object
//         let updateData = {
//             amount,
//             leftover: updatedLeftover,
//             description,
//             ended,
//             started,
//             status,
//             name,
//             mobile_no
//         };
//
//         // Remove undefined values to prevent overwriting with `undefined`
//         Object.keys(updateData).forEach(key => {
//             if (updateData[key] === undefined) delete updateData[key];
//         });
//
//         // Update booking with the filtered data
//         const updatedBooking = await Ground.findByIdAndUpdate(id, updateData, { new: true });
//         log(`SUCCESSFULLY_UPDATED_GROUND_BOOKING`);
//         res.json({ message: "Booking details updated.", updatedBooking });
//
//     } catch (error) {
//         log(`ERROR_UPDATING_GROUND`);
//         console.error("Error updating booking:", error);
//         res.status(500).json({ message: "Error updating booking details." });
//     }
// };
//
//
//
// const bal_id = "677ba181a9f86714ba5b860b"
// const newBooking = async (req, res) => {
//     try {
//
//         const {
//             name,
//             mobile_no,
//             booked_by,
//             start_date,
//             end_date,
//             amount,
//             ground,
//             payment_status,
//             plan_id,
//             payment_method,
//             status,
//             description,
//             advance,
//             advpaymentmode,
//             started,
//             ended,
//         } = req.body;
//         log(`NEW_GROUND_BOOKING_${name}_${mobile_no}`);
//         const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//         if (!balance1) {
//             return res.status(404).json("Balance record not found");
//         }
//
//         const bal = balance1.balance;
//         let balance_after_transaction, balance_before_transaction;
//         if (payment_status == "Pending") {
//             const newBooking1 = new Ground({
//                 name,
//                 mobile_no,
//                 booked_by: 'Manager',
//                 start_date,
//                 end_date,
//                 amount,
//                 ground,
//                 payment_method,
//                 payment_status,
//                 plan_id,
//                 status,
//                 description,
//                 advance,
//                 advpaymentmode,
//                 leftover: amount - advance,
//                 started,
//                 ended // Active status by default
//             });
//
//             await newBooking1.save();
//             //console.log(newBooking)
//             return res.json({
//                 message: 'Booking created successfully!',
//                 booking: newBooking
//             });
//
//         } else if (payment_status == "Paid") {
//             balance_after_transaction = Number(bal) + Number(amount);
//             balance_before_transaction = bal;
//
//             const newBooking1 = new Ground({
//             name,
//             mobile_no,
//             booked_by: 'Manager',
//             start_date,
//             end_date,
//             amount,
//             ground,
//             payment_method,
//             payment_status,
//             plan_id,
//             status,
//             description,
//             advance,
//             advpaymentmode,
//             leftover: amount - amount,
//             started,
//             ended // Active status by default
//         });
//             await newBooking1.save();
//
//             //console.log(newBooking1._id)
//             balance1.balance = balance_after_transaction;
//             await balance1.save();
//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount,
//                 description: "GROUND_BOOKING_" + ground + "_" + name,
//                 balance_before_transaction,
//                 method: payment_method,
//                 balance_after_transaction,
//                 identification:"GROUND_BOOKING_"+newBooking1._id.toHexString()
//             })
//             await newTrans.save();
//         } else if (payment_status == "Partial") {
//             if (Number(advance) > 0) {
//                 balance_after_transaction = Number(bal) + Number(advance);
//                 balance_before_transaction = bal;
//
//             }
//             const newBooking1 = new Ground({
//             name,
//             mobile_no,
//             booked_by: 'Manager',
//             start_date,
//             end_date,
//             amount,
//             ground,
//             payment_method,
//             payment_status,
//             plan_id,
//             status,
//             description,
//             advance,
//             advpaymentmode,
//             leftover: amount - advance,
//             started,
//             ended // Active status by default
//         });
//             await newBooking1.save();
//             //console.log(newBooking1._id)
//             balance1.balance = balance_after_transaction;
//             await balance1.save();
//             const newTrans = new Transaction({
//                     amt_in_out: "IN",
//                     amount: advance,
//                     description: "ADV_GROUND_BOOKING_" + ground + "_" + name,
//                     balance_before_transaction,
//                     method: advpaymentmode,
//                     balance_after_transaction,
//                 identification:"GROUND_BOOKING_"+newBooking1._id.toHexString()
//                 })
//                 await newTrans.save();
//         }
//         log(`GROUND_BOOKED_SUCCESSFULLY_${newBooking._id.toHexString}`);
//
// return res.json({
//             message: 'Booking created successfully!',
//             booking: newBooking
//         });
//     } catch (error) {
//         log(`ERROR_CREATING_NEW_BOOKING`);
//         //console.log(error)
//         res.status(500).json({
//             message: 'Error creating booking.'
//         });
//     }
// }
//
// const getStaffAttendance = async (req, res) => {
//     try {
//         const { userid, date } = req.body;
//         log(`FETCHING_STAFF_ATTENDANCE_${date}`);
//         // Verify user
//         const user = await User.findById(userid);
//         if (!user) {
//             return res.status(404).json({ message: "User Not Found" });
//         }
//
//         // Prepare date range
//         const queryDate = date ? new Date(date) : new Date();
//         queryDate.setHours(0, 0, 0, 0); // Start of the day
//         const nextDay = new Date(queryDate);
//         nextDay.setDate(nextDay.getDate() + 1);
//
//         // Fetch attendance records for the day
//         const attendanceRecords = await StaffAttendance.find({
//             createdOn: {
//                 $gte: queryDate,
//                 $lt: nextDay,
//             },
//         });
//         //console.log(attendanceRecords)
//
//         // Find present students
//         const presentStudents = await Promise.all(
//             attendanceRecords.map(async (record) => {
//                 try {
//                     const student = await Staff.findOne({
//                         roll_no: record.rollno,
//                         active: true,
//                         delete:false
//                     });
//                     if (!student) {
//                         console.warn(`No active staff member found for roll number: ${record.rollno}`);
//                         return null; // Skip unmatched records
//                     }
//                     return {
//                         name: student.name,
//                         rollno: student.roll_no,
//                         in_out:record.tap,
//                         time:record.createdOn
//                     };
//                 } catch (err) {
//                     console.error(`Error finding student for roll number ${record.rollno}:`, err.message);
//                     return null; // Skip errors
//                 }
//             })
//         );
//
//         // Filter out null values (unmatched records)
//         const filteredPresentStudents = presentStudents.filter(Boolean);
//
//         // Find all active students and identify absentees
//         const totalStudents = await Staff.find({ active: true,delete:false });
//         const absentStudents = totalStudents
//             .filter(
//                 (student) =>
//                     !filteredPresentStudents.some((present) => present.rollno === student.roll_no)
//             )
//             .map((student) => ({
//                 name: student.name,
//                 rollno: student.roll_no,
//
//             }));
//
//         // Send response
//         //console.log({date: queryDate.toDateString(),
//             // presentStudents: filteredPresentStudents,
//             // absentStudents,})
//         res.status(200).json({
//             date: queryDate.toDateString(),
//             presentStudents: filteredPresentStudents,
//             absentStudents,
//         });
//     } catch (error) {
//         log(`ERROR_FETCHING_STAFF_ATTENDANCE`);
//         console.error("Error fetching attendance summary:", error.message, error.stack);
//         return res.status(500).json({
//             message: "An error occurred while fetching the attendance summary.",
//             error: error.message,
//         });
//     }
// };
//
//
// require('dotenv').config();
//
// const takeAttendance = async (req, res) => {
//     try {
//         const { userid, rollno } = req.body;
//         log(`TAKING_ATTENDANCE_${rollno}`);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(404).json("User Not Found");
//         }
//
//         if (!rollno) {
//             return res.status(400).json({ message: "Roll number is required." });
//         }
//
//         const currentDate = new Date();
//         const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
//
//         if (String(rollno).startsWith("202")) {
//
//             const student = await Academy.findOne({ roll_no: rollno,active:true,delete:false });
//             if (!student) {
//                 return res.status(404).json({ message: "Student not found" });
//             }
//
//             const planExpiryDate = new Date(student.to);
//             const daysLeft = Math.ceil((planExpiryDate - new Date()) / (1000 * 60 * 60 * 24));
//
//             const attendanceExists = await Attendance.findOne({
//                 rollno,
//                 createdOn: { $gte: todayStart }
//             });
//
//             if (attendanceExists) {
//                 return res.status(201).json({ message: "Attendance already marked for today." });
//             }
//
//             if (daysLeft < 0) {
//                 return res.status(400).json({ message: "Plan expired. Please renew to mark attendance." });
//             }
//
//             const attendanceRecord = new Attendance({ rollno, active: true });
//             await attendanceRecord.save();
//             return res.status(200).json({
//                 message: `Attendance marked successfully.${daysLeft <= 3 ? ` Note: Plan is expiring in ${daysLeft} day(s).` : ''}`,
//                 attendanceDate: attendanceRecord.createdOn,
//             });
//         } else if (String(rollno).startsWith("COA") || String(rollno).startsWith("STA")) {
//             const staff = await Staff.findOne({ roll_no: rollno, delete: false, active: true });
//             if (!staff) {
//                 return res.status(403).json({ message: "No staff found for this ID" });
//             }
//
//             const lastAttendance = await StaffAttendance.findOne({ rollno, createdOn: { $gte: todayStart } }).sort({ createdOn: -1 });
//             const minutes=process.env.singleTap ;
//             //console.log(minutes)
//             const fiveMinutesAgo = new Date(Date.now() - minutes *  60 * 1000);
//
//             if (lastAttendance && lastAttendance.createdOn > fiveMinutesAgo) {
//                 return res.status(429).json({ message: "You cannot tap again within "+minutes+" minutes." });
//             }
//
//             const newTap = lastAttendance && lastAttendance.tap === "IN" ? "OUT" : "IN";
//             const staffAttendance = new StaffAttendance({ rollno, tap: newTap, active: true });
//             await staffAttendance.save();
//             log(`SUCCESSFULLY_MARKED_ATTENDANCE_${rollno}`);
//             return res.status(200).json({ message: `Successfully marked attendance for ${rollno} ${staff.name} : ${newTap}.`, tap: newTap, time: staffAttendance.createdOn });
//         } else {
//             return res.status(404).json({ message: "Not a valid roll number" });
//         }
//
//     } catch (error) {
//         log(`ERROR_MARKING_ATTENDANCE`);
//         console.error("Error marking attendance:", error);
//         return res.status(500).json({ message: "An error occurred while marking attendance." });
//     }
// };
//
// // const takeAttendance = async (req, res) => {
// //     try {
// //         const {
// //             userid,
// //             rollno
// //         } = req.body;
// //         const result1 = await User.findById(userid);
// //         if (!result1) {
// //             return res.status(404).json("User Not Found");
// //         }
//
// //         if (!rollno) {
// //             //console.log(1)
// //             return res.status(400).json({
// //                 message: "Roll number is required."
// //             });
// //         }
//
// //         const student = await Academy.findOne({
// //             roll_no: rollno
// //         });
// //         if (!student) {
// //             return res.status(404).json({
// //                 message: "Student not found"
// //             });
// //         }
//
// //         const currentDate = new Date();
// //         const planExpiryDate = new Date(student.to);
// //         const daysLeft = Math.ceil((planExpiryDate - currentDate) / (1000 * 60 * 60 * 24));
//
// //         const attendanceExists = await Attendance.findOne({
// //             rollno,
// //             createdOn: {
// //                 $gte: new Date(currentDate.setHours(0, 0, 0, 0))
// //             },
// //         });
//
// //         if (attendanceExists) {
// //             //console.log(2)
// //             return res.status(201).json({
// //                 message: "Attendance already marked for today."
// //             });
// //         }
//
// //         if (daysLeft < 0) {
// //             //console.log(3)
// //             return res.status(400).json({
// //                 message: "Plan expired. Please renew to mark attendance."
// //             });
// //         } else if (daysLeft <= 3) {
// //             const attendanceRecord = new Attendance({
// //                 rollno,
// //                 active: true
// //             });
// //             await attendanceRecord.save();
// //             return res.status(200).json({
// //                 message: `Attendance marked successfully. Note: Plan is expiring in ${daysLeft} day(s).`,
// //                 attendanceDate: attendanceRecord.createdOn,
// //             });
// //         } else {
// //             const attendanceRecord = new Attendance({
// //                 rollno,
// //                 active: true
// //             });
// //             await attendanceRecord.save();
// //             return res.status(200).json({
// //                 message: "Attendance marked successfully.",
// //                 attendanceDate: attendanceRecord.createdOn,
// //             });
// //         }
// //     } catch (error) {
// //         console.error("Error marking attendance:", error);
// //         return res.status(500).json({
// //             message: "An error occurred while marking attendance."
// //         });
// //     }
// // };
//
// const getAttendance = async (req, res) => {
//     try {
//         const { userid, date } = req.body;
//         log(`FETCHING_STUDENT_ATTENDANCE_${date}`);
//         // Verify user
//         const user = await User.findById(userid);
//         if (!user) {
//             return res.status(404).json({ message: "User Not Found" });
//         }
//
//         // Prepare date range
//         const queryDate = date ? new Date(date) : new Date();
//         queryDate.setHours(0, 0, 0, 0); // Start of the day
//         const nextDay = new Date(queryDate);
//         nextDay.setDate(nextDay.getDate() + 1);
//
//         // Fetch attendance records for the day
//         const attendanceRecords = await Attendance.find({
//             createdOn: {
//                 $gte: queryDate,
//                 $lt: nextDay,
//             },
//         });
//
//         // Find present students
//         const presentStudents = await Promise.all(
//             attendanceRecords.map(async (record) => {
//                 try {
//                     const student = await Academy.findOne({
//                         roll_no: record.rollno,
//                         active: true,
//                     });
//                     if (!student) {
//                         console.warn(`No active student found for roll number: ${record.rollno}`);
//                         return null; // Skip unmatched records
//                     }
//                     return {
//                         name: student.name,
//                         rollno: student.roll_no,
//                         expiringDate: student.to ? student.to.toDateString() : "N/A", // Handle undefined `to`
//                     };
//                 } catch (err) {
//                     console.error(`Error finding student for roll number ${record.rollno}:`, err.message);
//                     return null; // Skip errors
//                 }
//             })
//         );
//
//         // Filter out null values (unmatched records)
//         const filteredPresentStudents = presentStudents.filter(Boolean);
//
//         // Find all active students and identify absentees
//         const totalStudents = await Academy.find({ active: true });
//         const absentStudents = totalStudents
//             .filter(
//                 (student) =>
//                     !filteredPresentStudents.some((present) => present.rollno === student.roll_no)
//             )
//             .map((student) => ({
//                 name: student.name,
//                 rollno: student.roll_no,
//                 expiringDate: student.to ? student.to.toDateString() : "N/A", // Handle undefined `to`
//             }));
//
//         // Send response
//         res.status(200).json({
//             date: queryDate.toDateString(),
//             presentStudents: filteredPresentStudents,
//             absentStudents,
//         });
//     } catch (error) {
//         log(`ERROR_FETCHING_STUDENT_ATTENDANCE`);
//         console.error("Error fetching attendance summary:", error.message, error.stack);
//         return res.status(500).json({
//             message: "An error occurred while fetching the attendance summary.",
//             error: error.message,
//         });
//     }
// };
//
//
// const moment = require('moment');
// const mongoose = require("mongoose");
// const updateTrainees = async (req, res) => {
//     try {
//         const {
//             userid
//         } = req.body;
//         log(`UPDATING_TRAINEE_STATUS`);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(404).json("User Not Found");
//         }
//         // Calculate yesterday's date
//         const yesterday = moment().subtract(0, 'days').startOf('day').toDate();
//
//         // Find and update all records where the 'to' date is before yesterday and 'active' is true
//         const result = await Academy.updateMany({
//             to: {
//                 $lt: yesterday
//             },
//             active: true
//         }, {
//             $set: {
//                 active: false
//             }
//         });
//
//         // Log the result of the update
//         if (result.modifiedCount > 0) {
//             //console.log(`${result.modifiedCount} record(s) updated to inactive.`);
//         } else {
//             //console.log("No records found to update.");
//         }
//     } catch (error) {
//         console.error("Error updating expired plans:", error);
//     }
// }
//
// const updateTrainees1 = async (req, res) => {
//     try {
//
//         // Calculate yesterday's date
//         const yesterday = moment().subtract(0, 'days').startOf('day').toDate();
//
//         // Find and update all records where the 'to' date is before yesterday and 'active' is true
//         const result = await Academy.updateMany({
//             to: {
//                 $lt: yesterday
//             },
//             active: true
//         }, {
//             $set: {
//                 active: false
//             }
//         });
//
//         // Log the result of the update
//         if (result.modifiedCount > 0) {
//             //console.log(`${result.modifiedCount} record(s) updated to inactive.`);
//         } else {
//             //console.log("No records found to update.");
//         }
//     } catch (error) {
//         console.error("Error updating expired plans:", error);
//     }
// }
//
// const multer = require('multer');
// const storage = multer.memoryStorage(); // Store files in memory
// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 100 * 1024 * 1024
//     }, // 10 MB limit
// });
// const newTrainee = async (req, res) => {
//     try {
//         const {
//             name,
//             father,
//             dob,
//             address,
//             phone,
//             plan_id,
//             amount,
//             occupation,
//             currentClass,
//             schoolName,
//             dateAndPlace
//         } = req.body;
//         log(`ADD_NEW_TRAINEE_${name}`);
//         // Get files from request
//         // Generate roll number
//         let rollno = await Academy.countDocuments();
//         const roll_no = rollno + 20250001;
//
//         // Fetch plan details
//         const result = await DetailsAcademy.findById(plan_id);
//         if (!result) {
//             return res.status(404).json({
//                 message: 'Plan not found.'
//             });
//         }
//
//         const session = result.name;
//         const plan_time = result.plan_limit + " Days";
//         const today = moment();
//         const firstDate = today.add(1, 'days');
//         const secondDate = moment(today).add(result.plan_limit, 'days');
//
//         // Save to the database
//         const newT = new Academy({
//             roll_no,
//             name,
//             father,
//             amount,
//             session,
//             from: today,
//             to: secondDate,
//             plan_time,
//             occupation,
//             address,
//             phone,
//             dob,
//             name_of_school: schoolName,
//             current_class: currentClass,
//             photo: photoBuffer,
//             signature: traineeSignatureBuffer,
//             date_and_place: dateAndPlace,
//             father_signature: fathersignatureBuffer,
//             plan_id: new mongoose.Types.ObjectId(plan_id),
//         });
//         await newT.save();
//         log(`SUCCESSFULLY_ADDED_NEW_TRAINEE_${newT._id.toHexString()}`);
//         res.json({
//             message: 'Trainee created successfully!'
//         });
//     } catch (error) {
//         log(`ERROR_CREATING_TRAINEE`);
//         console.error("Error creating trainee:", error);
//         res.status(500).json({
//             message: 'Server error.'
//         });
//     }
// };
// module.exports = {
//     newTrainee,
//     newBooking,
//     updateBooking,
//     changeStatus,
//     updateTrainees,
//     updateTrainees1,
//     getAttendance,
//     takeAttendance,
//     getAllBookings,
//     getActivePlans,
//     getAllPlans,
//     getStaffAttendance,
//     getUpcomingBookings
// };


const DetailsTG = require('../models/DetailsTurfGround');
const DetailsAcademy = require('../models/DetailsAcademy');
const Status = require('../models/Status');
const CryptoJS = require('crypto-js');
const GroundBooking = require('../models/Ground');
const Ground = require('../models/Ground');
const User = require("../models/user");
const Attendance = require("../models/Attendance");
const Academy = require("../models/Academy");
const Transaction = require("../models/Transaction");
const StaffAttendance = require("../models/StaffAttendance");
const Staff = require("../models/Staff");
const Institute = require('../models/Institute');
const { log } = require("../Logs/logs");
require('dotenv').config();
const moment = require('moment');
const mongoose = require("mongoose");
const multer = require('multer');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 10 MB limit
});

// Helper function to calculate balance from transactions for an institute
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

const getActivePlans = async (req, res) => {
    try {
        log(`FETCH_ACTIVE_GROUND_PLANS`);
        const result = await DetailsTG.find({
            active: true,
            $or: [{ category: 'GROUND-A' }, { category: 'GROUND-B' }]
        }, {
            _id: 1,
            name: 1,
            amount: 1,
            time_hr: 1,
            time_min: 1,
            category: 1,
            sport: 1,
            from: 1,
            to: 1
        });
        res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_GROUND_PLANS`);
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUpcomingBookings = async (req, res) => {
    try {
        const currentDate = new Date();
        log(`FETCHING_GROUND_UPCOMING_BOOKINGS`);
        const bookings = await GroundBooking.find({
            start_date: { $gt: currentDate },
            status: true
        }).select('start_date end_date');
        res.status(200).json(bookings);
    } catch (error) {
        log(`ERROR_FETCHING_GROUND_UPCOMING_BOOKINGS`);
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        log(`FETCH_ALL_GROUND_BOOKING`);
        const { userId } = req.body;
        const result1 = await User.findById(userId);
        if (!result1 || result1.role !== "Manager") {
            log(`INVALID_MANAGER_${userId}`);
            return res.status(200).json("Not Found");
        }
        const bookings = await GroundBooking.find({ status: true });
        res.status(200).json(bookings);
    } catch (error) {
        log(`ERROR_FETCHING_ALL_BOOKINGS`);
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllPlans = async (req, res) => {
    try {
        const { userId } = req.body;
        log(`FETCHING_ALL_GROUND_PLANS`);
        const result1 = await User.findById(userId);
        if (!result1) {
            log(`INVALID_USER_${userId}`);
            return res.status(200).json("Not Found");
        }
        const result = await DetailsTG.find({
            $or: [{ category: 'GROUND-A' }, { category: 'GROUND-B' }]
        }, {
            _id: 1,
            name: 1,
            amount: 1,
            time_hr: 1,
            time_min: 1,
            category: 1,
            sport: 1,
            from: 1,
            to: 1,
            active: 1
        });
        res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_GROUND_PLANS`);
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        log(`CHANGE_GROUND_ID_STATUS_${req.params.id}`);
        const updatedBooking = await Ground.findByIdAndUpdate(req.params.id, { status }, { new: true });
        log(`SUCCESSFULLY_CHANGED_STATUS_${req.params.id}`);
        res.json({ message: 'Booking status updated.', updatedBooking });
    } catch (error) {
        log(`ERROR_CHANGING_GROUND_STATUS_${req.params.id || 'UNKNOWN'}`);
        res.status(500).json({ message: 'Error updating booking status.' });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, advance, description, ended, started, status, name, mobile_no } = req.body;
        log(`UPDATING_GROUND_BOOKING_${id}`);

        const existingBooking = await Ground.findById(id);
        if (!existingBooking) {
            log(`BOOKING_NOT_FOUND_${id}`);
            return res.status(404).json({ message: "Booking not found." });
        }

        let updatedLeftover = existingBooking.leftover;
        if (amount !== undefined && Number(amount) !== Number(existingBooking.amount)) {
            const paidAmount = Number(existingBooking.amount) - Number(existingBooking.leftover);
            updatedLeftover = Math.max(Number(amount) - paidAmount, 0);
        }

        let updateData = {
            amount,
            leftover: updatedLeftover,
            description,
            ended,
            started,
            status,
            name,
            mobile_no
        };

        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) delete updateData[key];
        });

        const updatedBooking = await Ground.findByIdAndUpdate(id, updateData, { new: true });
        log(`SUCCESSFULLY_UPDATED_GROUND_BOOKING_${id}`);
        res.json({ message: "Booking details updated.", updatedBooking });
    } catch (error) {
        log(`ERROR_UPDATING_GROUND_${id || 'UNKNOWN'}`);
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Error updating booking details." });
    }
};

const newBooking = async (req, res) => {
    try {
        const {
            name, mobile_no, booked_by, start_date, end_date, amount, ground,
            payment_status, plan_id, payment_method, status, description,
            advance, advpaymentmode, started, ended, instituteId
        } = req.body;
        log(`NEW_GROUND_BOOKING_${name}_${mobile_no}`);

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const newBooking = new Ground({
            name, mobile_no, booked_by: 'Manager', start_date, end_date, amount, ground,
            payment_method, payment_status, plan_id, status, description, advance,
            advpaymentmode, leftover: amount - (advance || 0), started, ended,
            institute: instituteId
        });
        await newBooking.save();

        if (payment_status === "Paid" || (payment_status === "Partial" && Number(advance) > 0)) {
            const balanceBefore = await calculateBalanceFromTransactions(instituteId);
            const paymentAmount = payment_status === "Paid" ? Number(amount) : Number(advance);
            const balanceAfter = balanceBefore + paymentAmount;

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount: paymentAmount,
                description: payment_status === "Paid" ?
                    `GROUND_BOOKING_${ground}_${name}` :
                    `ADV_GROUND_BOOKING_${ground}_${name}`,
                balance_before_transaction: balanceBefore,
                method: payment_status === "Paid" ? payment_method : advpaymentmode,
                balance_after_transaction: balanceAfter,
                identification: `GROUND_BOOKING_${newBooking._id.toHexString()}`,
                institute: instituteId,
                institute_name: institute.name,
                user: booked_by
            });
            await newTrans.save();
            log(`TRANSACTION_RECORDED_${newBooking._id.toHexString()}_${paymentAmount}`);
        }

        log(`GROUND_BOOKED_SUCCESSFULLY_${newBooking._id.toHexString()}`);
        res.json({ message: 'Booking created successfully!', booking: newBooking });
    } catch (error) {
        log(`ERROR_CREATING_NEW_BOOKING_${name || 'UNKNOWN'}`);
        console.error(error);
        res.status(500).json({ message: 'Error creating booking.' });
    }
};

const takeAttendance = async (req, res) => {
    try {
        const { userid, rollno } = req.body;
        log(`TAKING_ATTENDANCE_${rollno}`);

        const result1 = await User.findById(userid);
        if (!result1) {
            log(`INVALID_USER_${userid}`);
            return res.status(404).json("User Not Found");
        }

        if (!rollno) {
            return res.status(400).json({ message: "Roll number is required." });
        }

        const currentDate = new Date();
        const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));

        if (String(rollno).startsWith("202")) {
            const student = await Academy.findOne({ roll_no: rollno, active: true, delete: false });
            if (!student) {
                log(`STUDENT_NOT_FOUND_${rollno}`);
                return res.status(404).json({ message: "Student not found" });
            }

            const planExpiryDate = new Date(student.to);
            const daysLeft = Math.ceil((planExpiryDate - new Date()) / (1000 * 60 * 60 * 24));

            const attendanceExists = await Attendance.findOne({ rollno, createdOn: { $gte: todayStart } });
            if (attendanceExists) {
                return res.status(201).json({ message: "Attendance already marked for today." });
            }

            if (daysLeft < 0) {
                return res.status(400).json({ message: "Plan expired. Please renew to mark attendance." });
            }

            const attendanceRecord = new Attendance({ rollno, active: true });
            await attendanceRecord.save();
            log(`SUCCESSFULLY_MARKED_ATTENDANCE_${rollno}`);
            return res.status(200).json({
                message: `Attendance marked successfully.${daysLeft <= 3 ? ` Note: Plan is expiring in ${daysLeft} day(s).` : ''}`,
                attendanceDate: attendanceRecord.createdOn,
            });
        } else if (String(rollno).startsWith("COA") || String(rollno).startsWith("STA")) {
            const staff = await Staff.findOne({ roll_no: rollno, delete: false, active: true });
            if (!staff) {
                log(`STAFF_NOT_FOUND_${rollno}`);
                return res.status(403).json({ message: "No staff found for this ID" });
            }

            const lastAttendance = await StaffAttendance.findOne({ rollno, createdOn: { $gte: todayStart } }).sort({ createdOn: -1 });
            const minutes = process.env.singleTap;
            const fiveMinutesAgo = new Date(Date.now() - minutes * 60 * 1000);

            if (lastAttendance && lastAttendance.createdOn > fiveMinutesAgo) {
                return res.status(429).json({ message: `You cannot tap again within ${minutes} minutes.` });
            }

            const newTap = lastAttendance && lastAttendance.tap === "IN" ? "OUT" : "IN";
            const staffAttendance = new StaffAttendance({ rollno, tap: newTap, active: true });
            await staffAttendance.save();
            log(`SUCCESSFULLY_MARKED_ATTENDANCE_${rollno}`);
            return res.status(200).json({
                message: `Successfully marked attendance for ${rollno} ${staff.name} : ${newTap}.`,
                tap: newTap,
                time: staffAttendance.createdOn
            });
        } else {
            return res.status(404).json({ message: "Not a valid roll number" });
        }
    } catch (error) {
        log(`ERROR_MARKING_ATTENDANCE_${rollno || 'UNKNOWN'}`);
        console.error("Error marking attendance:", error);
        return res.status(500).json({ message: "An error occurred while marking attendance." });
    }
};

const getAttendance = async (req, res) => {
    try {
        const { userid, date } = req.body;
        log(`FETCHING_STUDENT_ATTENDANCE_${date}`);

        const user = await User.findById(userid);
        if (!user) {
            log(`INVALID_USER_${userid}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const queryDate = date ? new Date(date) : new Date();
        queryDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const attendanceRecords = await Attendance.find({
            createdOn: { $gte: queryDate, $lt: nextDay },
        });

        const presentStudents = await Promise.all(
            attendanceRecords.map(async (record) => {
                try {
                    const student = await Academy.findOne({ roll_no: record.rollno, active: true });
                    if (!student) return null;
                    return {
                        name: student.name,
                        rollno: student.roll_no,
                        expiringDate: student.to ? student.to.toDateString() : "N/A",
                    };
                } catch (err) {
                    console.error(`Error finding student for roll number ${record.rollno}:`, err.message);
                    return null;
                }
            })
        );

        const filteredPresentStudents = presentStudents.filter(Boolean);
        const totalStudents = await Academy.find({ active: true });
        const absentStudents = totalStudents
            .filter(student => !filteredPresentStudents.some(present => present.rollno === student.roll_no))
            .map(student => ({
                name: student.name,
                rollno: student.roll_no,
                expiringDate: student.to ? student.to.toDateString() : "N/A",
            }));

        res.status(200).json({
            date: queryDate.toDateString(),
            presentStudents: filteredPresentStudents,
            absentStudents,
        });
    } catch (error) {
        log(`ERROR_FETCHING_STUDENT_ATTENDANCE_${date || 'UNKNOWN'}`);
        console.error("Error fetching attendance summary:", error.message, error.stack);
        return res.status(500).json({
            message: "An error occurred while fetching the attendance summary.",
            error: error.message,
        });
    }
};

const getStaffAttendance = async (req, res) => {
    try {
        const { userid, date } = req.body;
        log(`FETCHING_STAFF_ATTENDANCE_${date}`);

        const user = await User.findById(userid);
        if (!user) {
            log(`INVALID_USER_${userid}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const queryDate = date ? new Date(date) : new Date();
        queryDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const attendanceRecords = await StaffAttendance.find({
            createdOn: { $gte: queryDate, $lt: nextDay },
        });

        const presentStudents = await Promise.all(
            attendanceRecords.map(async (record) => {
                try {
                    const student = await Staff.findOne({ roll_no: record.rollno, active: true, delete: false });
                    if (!student) return null;
                    return {
                        name: student.name,
                        rollno: student.roll_no,
                        in_out: record.tap,
                        time: record.createdOn
                    };
                } catch (err) {
                    console.error(`Error finding staff for roll number ${record.rollno}:`, err.message);
                    return null;
                }
            })
        );

        const filteredPresentStudents = presentStudents.filter(Boolean);
        const totalStudents = await Staff.find({ active: true, delete: false });
        const absentStudents = totalStudents
            .filter(student => !filteredPresentStudents.some(present => present.rollno === student.roll_no))
            .map(student => ({
                name: student.name,
                rollno: student.roll_no,
            }));

        res.status(200).json({
            date: queryDate.toDateString(),
            presentStudents: filteredPresentStudents,
            absentStudents,
        });
    } catch (error) {
        log(`ERROR_FETCHING_STAFF_ATTENDANCE_${date || 'UNKNOWN'}`);
        console.error("Error fetching attendance summary:", error.message, error.stack);
        return res.status(500).json({
            message: "An error occurred while fetching the attendance summary.",
            error: error.message,
        });
    }
};

const updateTrainees = async (req, res) => {
    try {
        const { userid } = req.body;
        log(`UPDATING_TRAINEE_STATUS`);

        const result1 = await User.findById(userid);
        if (!result1) {
            log(`INVALID_USER_${userid}`);
            return res.status(404).json("User Not Found");
        }

        const yesterday = moment().subtract(0, 'days').startOf('day').toDate();
        const result = await Academy.updateMany({
            to: { $lt: yesterday },
            active: true
        }, { $set: { active: false } });

        if (result.modifiedCount > 0) {
            log(`UPDATED_${result.modifiedCount}_TRAINEE_RECORDS`);
        } else {
            log(`NO_TRAINEE_RECORDS_UPDATED`);
        }
        res.status(200).json({ message: `${result.modifiedCount} trainee(s) updated.` });
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_STATUS`);
        console.error("Error updating expired plans:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// const updateTrainees1 = async (req, res) => {
//     try {
//         log(`AUTO_UPDATING_TRAINEE_STATUS`);
//         const yesterday = moment().subtract(0, 'days').startOf('day').toDate();
//         const result = await Academy.updateMany({
//             to: { $lt: yesterday },
//             active: true
//         }, { $set: { active: false } });
//
//         if (result.modifiedCount > 0) {
//             log(`AUTO_UPDATED_${result.modifiedCount}_TRAINEE_RECORDS`);
//         } else {
//             log(`NO_TRAINEE_RECORDS_AUTO_UPDATED`);
//         }
//         res.status(200).json({ message: `${result.modifiedCount} trainee(s) updated.` });
//     } catch (error) {
//         log(`ERROR_AUTO_UPDATING_TRAINEE_STATUS`);
//         console.error("Error updating expired plans:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const newTrainee = async (req, res) => {
    try {
        const {
            name, father, dob, address, phone, plan_id, amount, occupation,
            currentClass, schoolName, dateAndPlace, sport, institute
        } = req.body;
        log(`ADD_NEW_TRAINEE_${name}`);

        const instituteDoc = await Institute.findById(institute);
        if (!instituteDoc) {
            log(`INVALID_INSTITUTE_${institute}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        let rollno = await Academy.countDocuments();
        const roll_no = rollno + 20250001;

        const result = await DetailsAcademy.findById(plan_id);
        if (!result) {
            log(`PLAN_NOT_FOUND_${plan_id}`);
            return res.status(404).json({ message: 'Plan not found.' });
        }

        const session = result.name;
        const plan_time = result.plan_limit + " Days";
        const today = moment();
        const firstDate = today.add(1, 'days');
        const secondDate = moment(today).add(result.plan_limit, 'days');

        const newT = new Academy({
            roll_no, name, father, amount, session, from: today, to: secondDate,
            plan_time, occupation, address, phone, dob, name_of_school: schoolName,
            current_class: currentClass, photo: photoBuffer, signature: traineeSignatureBuffer,
            date_and_place: dateAndPlace, father_signature: fathersignatureBuffer,
            plan_id: new mongoose.Types.ObjectId(plan_id), sport, institute
        });
        await newT.save();

        log(`SUCCESSFULLY_ADDED_NEW_TRAINEE_${newT._id.toHexString()}`);
        res.json({ message: 'Trainee created successfully!' });
    } catch (error) {
        log(`ERROR_CREATING_TRAINEE_${name || 'UNKNOWN'}`);
        console.error("Error creating trainee:", error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getAllInstitutes = async (req, res) => {
    try {
        log(`FETCHING_ALL_INSTITUTES`);
        const institutes = await Institute.find({}, "name");
        res.status(200).json(institutes);
    } catch (error) {
        log(`ERROR_FETCHING_INSTITUTES`);
        console.error("Error fetching institutes:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const getTransactionsByInstitute = async (req, res) => {
    try {
        const { institute_name } = req.body;
        log(`FETCHING_TRANSACTIONS_BY_INSTITUTE_${institute_name}`);

        if (!institute_name) {
            return res.status(400).json({ message: "Institute name is required." });
        }

        const instituteExists = await Institute.findOne({ name: institute_name });
        if (!instituteExists) {
            log(`INSTITUTE_NOT_FOUND_${institute_name}`);
            return res.status(404).json({ message: "Institute not found." });
        }

        const transactions = await Transaction.find({ institute_name });
        res.status(200).json(transactions);
    } catch (error) {
        log(`ERROR_FETCHING_TRANSACTIONS_${institute_name || 'UNKNOWN'}`);
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    newTrainee,
    newBooking,
    updateBooking,
    changeStatus,
    updateTrainees,
    // updateTrainees1,
    getAttendance,
    takeAttendance,
    getAllBookings,
    getActivePlans,
    getAllPlans,
    getUpcomingBookings,
    getStaffAttendance,
    getTransactionsByInstitute,
    getAllInstitutes
};