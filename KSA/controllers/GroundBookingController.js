// const DetailsTG = require('../models/DetailsTurfGround');
// const Status=require('../models/Status');
// const CryptoJS = require('crypto-js');
// const Images = require("../models/TurfImages");
// const GroundBooking = require("../models/Ground");
// const User = require("../models/user");
// const Transaction = require("../models/Transaction");
// const { log } = require("../Logs/logs")
// const Balance = require("../models/Balance");
// const bal_id= "677ba181a9f86714ba5b860b"
//
// const getActiveDetailsGround = async (req, res) => {
//     try {
//         log(`FETCH_ACTIVE_GROUND_STATUS`);
//         const result = await Status.findOne({ name: 'GROUND' }); // Use findOne to get a single document
//         let status;
//
//         if (result && result.active) {  // Check if result exists and active is true
//             status = "ACTIVE";
//         } else {
//             status = "INACTIVE";
//         }
//
//         // //console.log("Backend Status:", status);  // Log status before encryption
//         const data = CryptoJS.AES.encrypt(status.toString(), "FetchGroundActiveStatus").toString();
//         // //console.log("Encrypted Status:", data);  // Log encrypted status
//
//         res.status(200).json({ "acstatus": data });  // Ensure the response has acstatus
//     } catch (error) {
//         log(`ERROR_FETCHING_GROUND_STATUS`);
//         console.error('Error Fetching Status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
// const getImages = async (req, res) => {
//     try {
//         log(`FETCHING_GROUND_IMAGES`);
//         // Fetch images where the active field is true
//         const images = await Images.find({ active: true }).sort({uploadedAt:-1}).limit(5); // Ensure we only fetch active images
//         res.json(images.map(img => ({
//             id: img._id,
//             title: img.title,
//             description: img.description,
//             contentType: img.contentType,
//             data: img.data.toString('base64')  // Convert binary data to base64 string
//         })));
//     } catch (error) {
//         log(`ERROR_FETCHING_GROUND_IMAGES`);
//         res.status(500).json({ message: 'Error fetching images' });
//     }
// };
//
//
// const getBookings=async (req,res)=>{
//     try {
//         log(`FETCHING_GROUND_BOOKING`);
//         const currentDate = new Date();
//
//         // Fetch only selected fields: `_id`, `name`, `booked_by`, `start_date`, `end_date`
//         const bookings = await GroundBooking.find({status:true});
//
//         res.status(200).json(bookings);
//     } catch (error) {
//         log(`ERROR_FETCHING_GROUND_BOOKING`);
//         console.error('Error fetching upcoming bookings:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
//
// // const MarkAsPaid = async (req, res) => {
//
// //     const {userid,id,method}=req.body;
//
// //     try{
// //         const result1 = await User.findById(userid);
// //         if (!result1) {
// //             return res.status(200).json("Not Found");
// //         }
// //         const booking_detail=await GroundBooking.findById(id);
// //         if (!booking_detail) {
// //             return res.status(200).json("Not Found");
// //         }
// //         else{
// //             const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
// //         if (!balance1) {
// //             return res.status(404).json("Balance record not found");
// //         }
//
// //         const bal = balance1.balance;
// //         let balance_after_transaction, balance_before_transaction;
// //             if (booking_detail.payment_status=='Paid'){
// //                 return res.status(200).json("Payment Status Already Paid");
// //             }
// //             else if(booking_detail.payment_status=='Partial'){
// //                 balance_after_transaction = Number(bal) + Number(booking_detail.leftover);
// //                 balance_before_transaction = bal;
// //                 balance1.balance = balance_after_transaction;
//
// //                 const newTrans = new Transaction({
// //                     amt_in_out: "IN",
// //                     amount:Number(booking_detail.leftover),
// //                     description: "GROUND_BOOKING_" + booking_detail.ground + "_" + booking_detail.name,
// //                     balance_before_transaction,
// //                     method,
// //                     balance_after_transaction,
// //                     identification:"GROUND_BOOKING_"+booking_detail._id.toHexString()
// //             })
// //             await newTrans.save();
// //                 await balance1.save();
// //                 booking_detail.leftover=0;
// //                 booking_detail.payment_status="Paid";
// //                 await booking_detail.save();
//
// //                 res.status(200).json({message:"Marked As Paid"})
// //             }
// //             else if(booking_detail.payment_status=='Pending'){
// //                 balance_after_transaction = Number(bal) + Number(booking_detail.amount);
// //                 balance_before_transaction = bal;
// //                 balance1.balance = balance_after_transaction;
//
// //                 const newTrans = new Transaction({
// //                     amt_in_out: "IN",
// //                     amount:Number(booking_detail.amount),
// //                     description: "GROUND_BOOKING_" + booking_detail.ground + "_" + booking_detail.name,
// //                     balance_before_transaction,
// //                     method,
// //                     balance_after_transaction,
// //                     identification:"GROUND_BOOKING_"+booking_detail._id.toHexString()
// //             })
// //             await newTrans.save();
// //                 await balance1.save();
// //                 booking_detail.leftover=0;
// //                 booking_detail.payment_status="Paid";
// //                 await booking_detail.save();
//
// //                 res.status(200).json({message:"Marked As Paid"})
// //             }
// //         }
// //     }catch (error){
// //         console.error('Error fetching upcoming bookings:', error);
// //         res.status(500).json({message: 'Server error'});
// //     }
//
// // }
//
//
//
// const MarkAsPaid = async (req, res) => {
//     const { userid, id, method, amount } = req.body;
//     log(`GROUND_MARK_AS_PAID_${id}_${amount}`);
//     try {
//         const manager = await User.findById(userid);
//         if (!manager || manager.role !== "Manager") {
//             log(`INVALID_GROUND_USER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         const booking_detail = await GroundBooking.findById(id);
//         if (!booking_detail) {
//             log(`INVALID_GROUND_${id}`);
//             return res.status(404).json({ message: "Booking Not Found" });
//         }
//
//         if (Number(amount) <= 0) {
//             log(`INVALID_GROUND_AMOUNT_${id}`);
//             return res.status(400).json({ message: "Invalid Payment Amount" });
//         }
//
//         const balance1 = await Balance.findById(bal_id);
//         if (!balance1) {
//
//             return res.status(404).json({ message: "Balance record not found" });
//         }
//
//         let balance_before_transaction = balance1.balance;
//         let balance_after_transaction = Number(balance_before_transaction) + Number(amount);
//
//         if (booking_detail.payment_status === "Paid") {
//             log(`GROUND_ALREADY_PAID_${id}`);
//             return res.status(200).json({ message: "Payment Status Already Paid" });
//         }
//
//         if (Number(amount) > booking_detail.leftover) {
//             log(`GROUND_AMOUNT_EXCEEDS_${id}_${amount}`);
//             return res.status(400).json({ message: "Amount exceeds the remaining balance" });
//         }
//
//         // Creating transaction entry
//         const newTrans = new Transaction({
//             amt_in_out: "IN",
//             amount: Number(amount)||0,
//             description: `GROUND_BOOKING_${booking_detail.ground}_${booking_detail.name}`,
//             balance_before_transaction,
//             method,
//             balance_after_transaction,
//             identification: `GROUND_BOOKING_${booking_detail._id.toHexString()}`
//         });
//
//         await newTrans.save();
//         log(`TRANSACTION_IN_${amount}_${id}`);
//         // Update balance record
//         balance1.balance = balance_after_transaction;
//         await balance1.save();
//
//         // Adjust payment status
//         booking_detail.leftover -= Number(amount);
//         if (booking_detail.leftover === 0) {
//             booking_detail.payment_status = "Paid";
//         } else {
//             booking_detail.payment_status = "Partial";
//         }
//         await booking_detail.save();
//
//         res.status(200).json({ message: "Payment Processed Successfully" });
//
//     } catch (error) {
//         log(`ERROR_IN_GROUND_MARK_AS_PAID`);
//         console.error("Error in processing payment:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
//
//
// const BookingTransactions = async (req, res) => {
//     const {userid,id}=req.body;
//     log(`FETCHING_TRANSACTIONS_${id}`);
//     try {
//         const result1 = await User.findById(userid);
//         if (!result1 || result1.role!=="Manager") {
//             return res.status(401).json("Not Found");
//         }
//         const booking_detail = await GroundBooking.findById(id);
//         if (!booking_detail) {
//             return res.status(402).json("Not Found");
//         }
//         const transactions=await Transaction.find({identification: "GROUND_BOOKING_"+id})
//         //console.log(transactions)
//         return res.status(200).json(transactions);
//     }
//     catch (error){
//         //console.log(error)
//         res.status(500).json({message:"SERVER ERROR"})
//     }
// }
//
//
// module.exports = {BookingTransactions,MarkAsPaid,getActiveDetailsGround,getImages ,getBookings};


const DetailsTG = require('../models/DetailsTurfGround');
const Status = require('../models/Status');
const CryptoJS = require('crypto-js');
const Images = require('../models/TurfImages');
const GroundBooking = require('../models/Ground');
const User = require('../models/user');
const Transaction = require('../models/Transaction');
const Institute = require('../models/Institute');
const { log } = require("../Logs/logs");

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

const getActiveDetailsGround = async (req, res) => {
    try {
        log(`FETCH_ACTIVE_GROUND_STATUS`);
        const result = await Status.findOne({ name: 'GROUND' });
        let status;

        if (result && result.active) {
            status = "ACTIVE";
        } else {
            status = "INACTIVE";
        }

        const data = CryptoJS.AES.encrypt(status.toString(), "FetchGroundActiveStatus").toString();
        res.status(200).json({ "acstatus": data });
    } catch (error) {
        log(`ERROR_FETCHING_GROUND_STATUS`);
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getImages = async (req, res) => {
    try {
        log(`FETCHING_GROUND_IMAGES`);
        const images = await Images.find({ active: true }).sort({ uploadedAt: -1 }).limit(5);
        res.json(images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            contentType: img.contentType,
            data: img.data.toString('base64')
        })));
    } catch (error) {
        log(`ERROR_FETCHING_GROUND_IMAGES`);
        res.status(500).json({ message: 'Error fetching images' });
    }
};

const getBookings = async (req, res) => {
    try {
        log(`FETCHING_GROUND_BOOKING`);
        const currentDate = new Date();
        const bookings = await GroundBooking.find({ status: true });
        res.status(200).json(bookings);
    } catch (error) {
        log(`ERROR_FETCHING_GROUND_BOOKING`);
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const MarkAsPaid = async (req, res) => {
    const { userid, id, method, amount, instituteId } = req.body;
    log(`GROUND_MARK_AS_PAID_${id}_${amount}`);

    try {
        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_GROUND_USER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const booking_detail = await GroundBooking.findById(id);
        if (!booking_detail) {
            log(`INVALID_GROUND_${id}`);
            return res.status(404).json({ message: "Booking Not Found" });
        }

        if (Number(amount) <= 0) {
            log(`INVALID_GROUND_AMOUNT_${id}`);
            return res.status(400).json({ message: "Invalid Payment Amount" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        // Calculate current balance from transactions
        const balanceBefore = await calculateBalanceFromTransactions(instituteId);
        const balanceAfter = balanceBefore + Number(amount);

        if (booking_detail.payment_status === "Paid") {
            log(`GROUND_ALREADY_PAID_${id}`);
            return res.status(200).json({ message: "Payment Status Already Paid" });
        }

        if (Number(amount) > booking_detail.leftover) {
            log(`GROUND_AMOUNT_EXCEEDS_${id}_${amount}`);
            return res.status(400).json({ message: "Amount exceeds the remaining balance" });
        }

        const newTrans = new Transaction({
            amt_in_out: "IN",
            amount: Number(amount),
            description: `GROUND_BOOKING_${booking_detail.ground}_${booking_detail.name}`,
            balance_before_transaction: balanceBefore,
            method,
            balance_after_transaction: balanceAfter,
            identification: `GROUND_BOOKING_${booking_detail._id.toHexString()}`,
            institute: instituteId,
            institute_name: institute.name,
            user: userid
        });

        await newTrans.save();
        log(`TRANSACTION_IN_${amount}_${id}`);

        booking_detail.leftover -= Number(amount);
        if (booking_detail.leftover === 0) {
            booking_detail.payment_status = "Paid";
        } else {
            booking_detail.payment_status = "Partial";
        }
        await booking_detail.save();

        res.status(200).json({ message: "Payment Processed Successfully" });
    } catch (error) {
        log(`ERROR_IN_GROUND_MARK_AS_PAID_${id || 'UNKNOWN'}`);
        console.error("Error in processing payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const BookingTransactions = async (req, res) => {
    const { userid, id } = req.body;
    log(`FETCHING_TRANSACTIONS_${id}`);

    try {
        const user = await User.findById(userid);
        if (!user || user.role !== "Manager") {
            log(`INVALID_USER_${userid}`);
            return res.status(401).json({ message: "Manager Not Found" });
        }

        const booking_detail = await GroundBooking.findById(id);
        if (!booking_detail) {
            log(`INVALID_BOOKING_${id}`);
            return res.status(402).json({ message: "Booking Not Found" });
        }

        const transactions = await Transaction.find({ identification: `GROUND_BOOKING_${id}` });
        return res.status(200).json(transactions);
    } catch (error) {
        log(`ERROR_FETCHING_TRANSACTIONS_${id}`);
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    BookingTransactions,
    MarkAsPaid,
    getActiveDetailsGround,
    getImages,
    getBookings
};