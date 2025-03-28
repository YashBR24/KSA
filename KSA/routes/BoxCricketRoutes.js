// const express = require('express');
// const DetailsTG = require("../models/DetailsTurfGround")
// const { log } = require("../Logs/logs")
// const router = express.Router();
// const Turf= require("../models/Turf")
// const Transaction = require("../models/Transaction")
// const Balance = require("../models/Balance")
// const User = require("../models/user");
// const bal_id= "677ba181a9f86714ba5b860b"
//
// router.post('/book',async (req, res) => {
//     try {
//         //console.log("Started")
//         const {
//             userid,
//             name,
//             mobile_no,
//             advance,
//             start_date,
//             end_date,
//             payment_status,
//             plan_id,
//             payment_method,
//             amount,
//         } = req.body;
//         log(`BOX_CRICKET_BOOKING_${userid}_${name}_${amount}`);
//         const manager = await User.findById(userid);
//         if (!manager || manager.role !== "Manager") {
//             //console.log("Not Found")
//             return res.status(404).json({message: "Manager not found"});
//         }
//         if (payment_status === "Paid") {
//             const data = new Turf({
//                 name,
//                 mobile_no,
//                 amount,
//                 payment_method,
//                 payment_status,
//                 status: true,
//                 plan_id
//             })
//             await data.save();
//             const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//             if (!balance1) {
//                 return res.status(404).json("Balance record not found");
//             }
//             const bal = balance1.balance;
//             let balance_after_transaction;
//             balance_after_transaction = Number(bal) + Number(amount);
//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount,
//                 description: "BOX_CRICKET_" + name,
//                 balance_before_transaction: bal,
//                 method: payment_method,
//                 balance_after_transaction,
//                 identification: "BOX_CRICKET_" + data._id.toHexString()
//             })
//             newTrans.save();
//             balance1.balance = balance_after_transaction;
//             balance1.save();
//             return res.status(200).json({message: "SUCCESSFULLY BOOKED"})
//         } else if (payment_status === "Partial") {
//             const data = new Turf({
//                 name,
//                 mobile_no,
//                 booked_by: 'Manager',
//                 start_date,
//                 end_date,
//                 amount,
//                 payment_method,
//                 payment_status,
//                 status: true,
//                 plan_id,
//                 leftover: Number(amount) - Number(advance)
//             })
//             await data.save();
//             const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//             if (!balance1) {
//                 return res.status(404).json("Balance record not found");
//             }
//             const bal = balance1.balance;
//             let balance_after_transaction;
//             balance_after_transaction = Number(bal) + Number(advance);
//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount: advance,
//                 description: "ADV_BOX_CRICKET_" + name,
//                 balance_before_transaction: bal,
//                 method: payment_method,
//                 balance_after_transaction,
//                 identification: "BOX_CRICKET_" + data._id.toHexString()
//             })
//             newTrans.save();photos_Coach.zip
//             balance1.balance = balance_after_transaction;
//             balance1.save();
//             return res.status(200).json({message: "SUCCESSFULLY BOOKED"})
//         } else if (payment_status === "Pending") {
//             const data = new Turf({
//                 name,
//                 mobile_no,
//                 booked_by: 'Manager',
//                 start_date,
//                 end_date,
//                 amount,
//                 payment_method,
//                 payment_status,
//                 status: true,
//                 plan_id,
//                 leftover: Number(amount)
//             })
//             await data.save();
//             log(`BOX_BOOKED_SUCCESSFULLY_${data._id.toHexString()}`);
//             return res.status(200).json({message: "SUCCESSFULLY BOOKED"})
//         }
//     }
//     catch (err){
//         log(`ERROR_BOOKING_BOX`);
//         //console.log(err);
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// });
//
// router.post('/update', async (req, res) => {
//     try {
//         const { userid, name, mobile_no, status, played, id, amount } = req.body;
//         log(`UPDATING_BOX_BOOKING_${id}_BY_${userid}`)
//         const manager = await User.findById(userid);
//         if (!manager || manager.role !== "Manager") {
//             //console.log("Not Found");
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         const data = await Turf.findById(id);
//         if (!data) {
//             return res.status(404).json({ message: "Turf not found" });
//         }
//
//         data.name = name || data.name;
//         data.mobile_no = mobile_no || data.mobile_no;
//         data.status = status || data.status;
//         data.played = played || data.played;
//
//         if (data.payment_status === "Pending") {
//             data.amount = amount || data.amount;
//             data.leftover = amount;
//         } else if (data.payment_status === "Partial") {
//             if (amount) {
//                 data.leftover = Math.max(data.leftover - amount, 0);
//                 data.amount += amount;
//                 if (data.leftover === 0) {
//                     data.payment_status = "Completed";
//                 }
//             }
//         }
//
//         await data.save();
//         return res.status(200).json({ message: "Turf updated successfully", data });
//     } catch (error) {
//         log(`ERROR_UPDATING_BOX_CRICKET`)
//         console.error("Error updating turf:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });
//
// router.post('/mark-as-paid',async (req,res)=>{
//     const {userid,amount,id,payment_method} = req.body;
//     log(`BOX_MARK_AS_PAID_${id}_${amount}_${userid}`)
//     const manager = await User.findById(userid);
//     if (!manager || manager.role !== "Manager") {
//         //console.log("Not Found");
//         return res.status(404).json({ message: "Manager not found" });
//     }
//     if (Number(amount) <= 0) {
//         return res.status(403).json({ message: "INVALID AMOUNT" });
//     }
//
//     const data = await Turf.findById(id);
//     if (!data || data.payment_status==="Paid"){
//         return res.status(404).json({message:"Not Found"})
//     }
//     if (data.payment_status === "Pending" && Number(amount) > 0 ) {
//            data.payment_status="Partial"
//     }
//     if (Number(amount)===data.leftover){
//         data.payment_status="Paid"
//         const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//         if (!balance1) {
//             return res.status(404).json("Balance record not found");
//         }
//         const bal = balance1.balance;
//         let balance_after_transaction;
//         balance_after_transaction = Number(bal) + Number(amount);
//         const newTrans = new Transaction({
//             amt_in_out: "IN",
//             amount,
//             description: "BOX_CRICKET_" + data.name,
//             balance_before_transaction: bal,
//             method: payment_method,
//             balance_after_transaction,
//             identification: "BOX_CRICKET_" + data._id.toHexString()
//         })
//         await newTrans.save();
//         balance1.balance = balance_after_transaction;
//         await balance1.save();
//         data.leftover=0;
//         await data.save()
//         return res.status(200).json({message: "SUCCESSFULLY BOOKED"})
//     }
//     else if (Number(amount) < data.leftover){
//
//         const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//         if (!balance1) {
//             return res.status(404).json("Balance record not found");
//         }
//         const bal = balance1.balance;
//         let balance_after_transaction;
//         balance_after_transaction = Number(bal) + Number(amount);
//         const newTrans = new Transaction({
//             amt_in_out: "IN",
//             amount,
//             description: "ADV_BOX_CRICKET_" + name,
//             balance_before_transaction: bal,
//             method: payment_method,
//             balance_after_transaction,
//             identification: "BOX_CRICKET_" + data._id.toHexString()
//         })
//         await newTrans.save();
//         balance1.balance = balance_after_transaction;
//         await balance1.save();
//         data.leftover=Number(data.leftover)-Number(amount);
//         await data.save()
//         return res.status(200).json({message: "SUCCESSFULLY BOOKED"})
//     }
//     else{
//         return res.status(404).json({message:"Not Found"})
//     }
//
// })
//
// router.post('/get-all-bookings',async (req,res)=>{
//     const {userid}= req.body;
//     log(`FETCH_ALL_BOX_BOOKINGS`)
//     const manager = await User.findById(userid);
//     if (!manager || manager.role !== "Manager") {
//         //console.log("Not Found");
//         return res.status(404).json({ message: "Manager not found" });
//     }
//
//     const data = await Turf.find();
//
//     return res.status(200).json(data)
//
// })
//
// router.post('/plans',async (req,res)=>{
//     try{
//         log(`FETHCING_ALL_BOX_PLANS`)
//         const {userid}=req.body;
//         const manager = await User.findById(userid);
//         if (!manager || manager.role !== "Manager") {
//             //console.log("Not Found");
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         const data = await DetailsTG.find({active: true})
//         return res.status(200).json(data)
//     }catch (err){
//         //console.log(err)
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// })
//
// router.post("/add-plan",async (req,res)=>{
//     try{
//         const {userid}=req.body;
//         log(`ADDING_BOX_PLAN_${userid}`)
//         const manager = await User.findById(userid);
//         if (!manager || manager.role !== "Manager") {
//             //console.log("Not Found");
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         const {name,amount,time_hr,time_min,category,sport,from,to} = req.body;
//         const data = new DetailsTG ({
//             name,amount,time_hr,time_min,category,sport,from,to,
//         })
//         await data.save();
//
//         log(`ADDED_BOX_PLAN_${name}_${amount}`)
//         return res.status(200).json({message: "SUCCESSFULLY BOOKED"})
//     }catch (err){
//
//         log(`ERROR_ADDING_BOX_CRICKET_PLAN`)
//         //console.log(err)
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// })
//
// router.post("/edit-plan", async (req, res) => {
//     try {
//         const { userid, _id:planid, name, amount, time_hr, time_min, category, sport, from, to,active } = req.body;
//         log(`EDITING_PLAN_${planid}_BY_${userid}`)
//         //console.log('edit')
//         //console.log(req.body)
//         // Check if the user is a Manager
//         const manager = await User.findById(userid);
//         if (!manager || manager.role !== "Manager") {
//             //console.log("Not Found");
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         // Find and update the existing plan
//         const updatedPlan = await DetailsTG.findByIdAndUpdate(
//             planid,
//             { name, amount, time_hr, time_min, category, sport, from, to ,active},
//             { new: true } // Returns the updated document
//         );
//
//         if (!updatedPlan) {
//             //console.log("error")
//             return res.status(404).json({ message: "Plan not found" });
//         }
//         //console.log('sucessfull')
//         return res.status(200).json({ message: "Plan successfully updated", updatedPlan });
//     } catch (err) {
//         log(`ERROR_EDITING_PLAN`)
//         console.log(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// });
//
//
// module.exports = router;

const express = require('express');
const router = express.Router();
const DetailsTG = require("../models/DetailsTurfGround");
const Turf = require("../models/Turf");
const Transaction = require("../models/Transaction");
const User = require("../models/user");
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

// Book a turf
router.post('/book', async (req, res) => {
    try {
        const { userid, name, mobile_no, advance, start_date, end_date, payment_status, plan_id, payment_method, amount, instituteId } = req.body;
        log(`BOX_CRICKET_BOOKING_${userid}_${name}_${amount}`);

        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const plan = await DetailsTG.findById(plan_id);
        if (!plan) {
            log(`INVALID_PLAN_${plan_id}`);
            return res.status(404).json({ message: "Plan not found" });
        }

        const data = new Turf({
            name,
            mobile_no,
            booked_by: 'Manager',
            start_date,
            end_date,
            amount,
            payment_method,
            payment_status,
            status: true,
            plan_id,
            leftover: payment_status === "Pending" ? Number(amount) : Number(amount) - Number(advance || 0),
            institute: instituteId,
            institute_name: institute.name
        });
        await data.save();

        if (payment_status === "Paid" || (payment_status === "Partial" && Number(advance) > 0)) {
            const balanceBefore = await calculateBalanceFromTransactions(instituteId);
            const paymentAmount = payment_status === "Paid" ? Number(amount) : Number(advance);
            const balanceAfter = balanceBefore + paymentAmount;

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount: paymentAmount,
                description: payment_status === "Paid" ? `BOX_CRICKET_${name}` : `ADV_BOX_CRICKET_${name}`,
                balance_before_transaction: balanceBefore,
                method: payment_method,
                balance_after_transaction: balanceAfter,
                identification: `BOX_CRICKET_${data._id.toHexString()}`,
                institute: instituteId,
                institute_name: institute.name,
                user: userid
            });
            await newTrans.save();
            log(`TRANSACTION_RECORDED_${data._id.toHexString()}_${paymentAmount}`);
        }

        log(`BOX_BOOKED_SUCCESSFULLY_${data._id.toHexString()}`);
        return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
    } catch (err) {
        log(`ERROR_BOOKING_BOX_${userid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
});

// Update a turf booking
router.post('/update', async (req, res) => {
    try {
        const { userid, name, mobile_no, status, played, id, amount } = req.body;
        log(`UPDATING_BOX_BOOKING_${id}_BY_${userid}`);

        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const data = await Turf.findById(id);
        if (!data) {
            log(`TURF_NOT_FOUND_${id}`);
            return res.status(404).json({ message: "Turf not found" });
        }

        data.name = name || data.name;
        data.mobile_no = mobile_no || data.mobile_no;
        data.status = status || data.status;
        data.played = played || data.played;

        if (data.payment_status === "Pending" && amount) {
            data.amount = amount;
            data.leftover = amount;
        } else if (data.payment_status === "Partial" && amount) {
            data.leftover = Math.max(data.leftover - amount, 0);
            data.amount += Number(amount);
            if (data.leftover === 0) data.payment_status = "Completed";
        }

        await data.save();
        log(`SUCCESSFULLY_UPDATED_BOX_BOOKING_${id}`);
        return res.status(200).json({ message: "Turf updated successfully", data });
    } catch (error) {
        log(`ERROR_UPDATING_BOX_CRICKET_${id || 'UNKNOWN'}`);
        console.error("Error updating turf:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Mark a turf booking as paid
router.post('/mark-as-paid', async (req, res) => {
    try {
        const { userid, amount, id, payment_method, instituteId } = req.body;
        log(`BOX_MARK_AS_PAID_${id}_${amount}_${userid}`);

        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        if (Number(amount) <= 0) {
            return res.status(403).json({ message: "INVALID AMOUNT" });
        }

        const data = await Turf.findById(id);
        if (!data || data.payment_status === "Paid") {
            log(`INVALID_TURF_OR_ALREADY_PAID_${id}`);
            return res.status(404).json({ message: "Not Found" });
        }

        const balanceBefore = await calculateBalanceFromTransactions(instituteId);
        let balanceAfter;

        if (data.payment_status === "Pending" && Number(amount) > 0) {
            data.payment_status = "Partial";
        }

        if (Number(amount) === data.leftover) {
            data.payment_status = "Paid";
            balanceAfter = balanceBefore + Number(amount);
            data.leftover = 0;
        } else if (Number(amount) < data.leftover) {
            balanceAfter = balanceBefore + Number(amount);
            data.leftover = Number(data.leftover) - Number(amount);
        } else {
            log(`INVALID_PAYMENT_AMOUNT_${id}_${amount}`);
            return res.status(404).json({ message: "Not Found" });
        }

        const newTrans = new Transaction({
            amt_in_out: "IN",
            amount,
            description: data.payment_status === "Paid" ? `BOX_CRICKET_${data.name}` : `ADV_BOX_CRICKET_${data.name}`,
            balance_before_transaction: balanceBefore,
            method: payment_method,
            balance_after_transaction: balanceAfter,
            identification: `BOX_CRICKET_${data._id.toHexString()}`,
            institute: instituteId,
            institute_name: institute.name,
            user: userid
        });
        await newTrans.save();
        await data.save();

        log(`SUCCESSFULLY_MARKED_PAID_${id}_${amount}`);
        return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
    } catch (error) {
        log(`ERROR_MARKING_PAID_${id || 'UNKNOWN'}`);
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
});

// Fetch all bookings
router.post('/get-all-bookings', async (req, res) => {
    try {
        const { userid } = req.body;
        log(`FETCH_ALL_BOX_BOOKINGS`);

        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const data = await Turf.find();
        return res.status(200).json(data);
    } catch (error) {
        log(`ERROR_FETCHING_BOX_BOOKINGS`);
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
});

// Fetch all plans (merged from new code's /plans GET route)
router.get('/plans', async (req, res) => {
    try {
        log(`FETCHING_ALL_BOX_PLANS`);
        const data = await DetailsTG.find({ active: true });
        return res.status(200).json(data);
    } catch (err) {
        log(`ERROR_FETCHING_BOX_PLANS`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
});

// Add a new plan
router.post('/add-plan', async (req, res) => {
    try {
        const { userid, name, amount, time_hr, time_min, category, sport, from, to } = req.body;
        log(`ADDING_BOX_PLAN_${userid}`);

        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const data = new DetailsTG({ name, amount, time_hr, time_min, category, sport, from, to });
        await data.save();

        log(`ADDED_BOX_PLAN_${name}_${amount}`);
        return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
    } catch (err) {
        log(`ERROR_ADDING_BOX_CRICKET_PLAN`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
});

// Edit a plan
router.post('/edit-plan', async (req, res) => {
    try {
        const { userid, _id: planid, name, amount, time_hr, time_min, category, sport, from, to, active } = req.body;
        log(`EDITING_PLAN_${planid}_BY_${userid}`);

        const manager = await User.findById(userid);
        if (!manager || manager.role !== "Manager") {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const updatedPlan = await DetailsTG.findByIdAndUpdate(
            planid,
            { name, amount, time_hr, time_min, category, sport, from, to, active },
            { new: true }
        );

        if (!updatedPlan) {
            log(`PLAN_NOT_FOUND_${planid}`);
            return res.status(404).json({ message: "Plan not found" });
        }

        log(`SUCCESSFULLY_EDITED_PLAN_${planid}`);
        return res.status(200).json({ message: "Plan successfully updated", updatedPlan });
    } catch (err) {
        log(`ERROR_EDITING_PLAN_${planid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
});

// Routes from new code (TurfBookingController)
router.get('/details', async (req, res) => {
    try {
        log(`FETCHING_DEFAULT_ONE_HOUR_PRICE`);
        const result = await DetailsTG.find({ time_hr: 1, time_min: 0, active: true, category: 'TURF', sport: 'Cricket' });
        res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_DEFAULT_PRICE`);
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/upcoming-bookings', async (req, res) => {
    try {
        log(`FETCHING_UPCOMING_BOOKINGS`);
        const currentDate = new Date();
        const bookings = await Turf.find({ start_date: { $gt: currentDate }, status: true }).select('start_date end_date');
        res.status(200).json(bookings);
    } catch (error) {
        log(`ERROR_FETCHING_UPCOMING_BOOKINGS`);
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Note: getActiveDetailsTurf and getImages are not included as they depend on Status and Images models not present in the old code

module.exports = router;