//
// const express = require('express');
// const mongoose = require('mongoose');
// const router = express.Router();
// const DetailsTG = require("../models/DetailsTurfGround");
// const Turf = require("../models/Turf");
// const Transaction = require("../models/Transaction");
// const Institute = require('../models/Institute');
// const User = require('../models/User');
// const { log } = require("../Logs/logs");
//
// const authenticateUser = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             console.log(`Authorization header missing in ${req.path}`);
//             return res.status(401).json({ message: "Authorization header missing" });
//         }
//
//         const userid = authHeader.split(' ')[1];
//         if (!userid) {
//             console.log(`User ID not provided in Authorization header in ${req.path}`);
//             return res.status(401).json({ message: "User ID not provided in authorization" });
//         }
//
//         const user = await User.findById(userid);
//         if (!user) {
//             console.log(`User not found for ID: ${userid} in ${req.path}`);
//             return res.status(404).json({ message: "User not found" });
//         }
//
//         if (user.role !== "Manager" && user.role !== "Admin") {
//             console.log(`Unauthorized role: ${user.role} for user ID: ${userid} in ${req.path}`);
//             return res.status(403).json({ message: "Unauthorized: Only Managers or Admins allowed" });
//         }
//
//         req.user = user; // Attach user to request object
//         next();
//     } catch (error) {
//         console.error(`Error in authentication middleware for ${req.path}:`, error);
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
//
// router.use(authenticateUser);
//
// router.post('/book', async (req, res) => {
//     try {
//         const {
//             name,
//             mobile_no,
//             advance,
//             start_date,
//             end_date,
//             payment_status,
//             plan_id,
//             payment_method,
//             amount,
//             instituteId
//         } = req.body;
//
//         if (!instituteId || typeof instituteId !== 'string' || instituteId.trim() === "") {
//             return res.status(400).json({ message: "Invalid or missing instituteId" });
//         }
//
//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             return res.status(404).json({ message: "Institute not found" });
//         }
//
//         const bookedBy = req.user.role === "Manager" ? "Manager" : "Admin";
//         const turfData = {
//             userid: req.user._id,  // Using userid to match the schema
//             name,
//             mobile_no,
//             booked_by: bookedBy,
//             start_date,
//             end_date,
//             amount,
//             payment_method,
//             payment_status,
//             status: true,
//             plan_id,
//             institute: instituteId,
//             institute_name: institute.name,
//             advance: Number(advance)
//         };
//
//         const data = new Turf(turfData);
//
//         if (payment_status === "Paid") {
//             data.leftover = 0;
//             await data.save();
//
//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount,
//                 description: `BOX_CRICKET_${name}`,
//                 method: payment_method,
//                 identification: `BOX_CRICKET_${data._id.toHexString()}`,
//                 institute: instituteId,
//                 institute_name: institute.name,
//                 user: req.user._id
//             });
//             await newTrans.save();
//
//             return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
//         } else if (payment_status === "Partial" || (payment_status === "Pending" && Number(advance) > 0)) {
//             data.leftover = Number(amount) - Number(advance);
//             data.payment_status = "Partial"; // Adjust status if advance is provided
//             await data.save();
//
//             if (Number(advance) > 0) {
//                 const newTrans = new Transaction({
//                     amt_in_out: "IN",
//                     amount: advance,
//                     description: `ADV_BOX_CRICKET_${name}`,
//                     method: payment_method,
//                     identification: `BOX_CRICKET_${data._id.toHexString()}`,
//                     institute: instituteId,
//                     institute_name: institute.name,
//                     user: req.user._id
//                 });
//                 await newTrans.save();
//             }
//
//             return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
//         } else if (payment_status === "Pending") {
//             data.leftover = Number(amount);
//             await data.save();
//             return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
//         } else {
//             return res.status(400).json({ message: "Invalid payment_status" });
//         }
//     } catch (err) {
//         console.error("Error in /book:", err);
//         return res.status(500).json({ message: "SERVER ERROR", error: err.message });
//     }
// });
//
// // Update a turf booking
// router.post('/update', async (req, res) => {
//     try {
//         const { userid, name, mobile_no, status, played, id, amount } = req.body;
//         log(`UPDATING_BOX_BOOKING_${id}_BY_${userid}`);
//
//
//
//         const data = await Turf.findById(id);
//         if (!data) {
//             log(`TURF_NOT_FOUND_${id}`);
//             return res.status(404).json({ message: "Turf not found" });
//         }
//
//         data.name = name || data.name;
//         data.mobile_no = mobile_no || data.mobile_no;
//         data.status = status || data.status;
//         data.played = played || data.played;
//
//         if (data.payment_status === "Pending" && amount) {
//             data.amount = amount;
//             data.leftover = amount;
//         } else if (data.payment_status === "Partial" && amount) {
//             data.leftover = Math.max(data.leftover - amount, 0);
//             data.amount += Number(amount);
//             if (data.leftover === 0) data.payment_status = "Completed";
//         }
//
//         await data.save();
//         log(`SUCCESSFULLY_UPDATED_BOX_BOOKING_${id}`);
//         return res.status(200).json({ message: "Turf updated successfully", data });
//     } catch (error) {
//         log(`ERROR_UPDATING_BOX_CRICKET_${id || 'UNKNOWN'}`);
//         console.error("Error updating turf:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });
//
// // Mark a turf booking as paid
// router.post('/mark-as-paid', async (req, res) => {
//     try {
//         const { userid, amount, id, payment_method, instituteId } = req.body;
//         log(`BOX_MARK_AS_PAID_${id}_${amount}_${userid}`);
//
//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }
//
//         if (Number(amount) <= 0) {
//             return res.status(403).json({ message: "INVALID AMOUNT" });
//         }
//
//         const data = await Turf.findById(id);
//         if (!data || data.payment_status === "Paid") {
//             log(`INVALID_TURF_OR_ALREADY_PAID_${id}`);
//             return res.status(404).json({ message: "Not Found" });
//         }
//
//         const balanceBefore = await calculateBalanceFromTransactions(instituteId);
//         let balanceAfter;
//
//         if (data.payment_status === "Pending" && Number(amount) > 0) {
//             data.payment_status = "Partial";
//         }
//
//         if (Number(amount) === data.leftover) {
//             data.payment_status = "Paid";
//             balanceAfter = balanceBefore + Number(amount);
//             data.leftover = 0;
//         } else if (Number(amount) < data.leftover) {
//             balanceAfter = balanceBefore + Number(amount);
//             data.leftover = Number(data.leftover) - Number(amount);
//         } else {
//             log(`INVALID_PAYMENT_AMOUNT_${id}_${amount}`);
//             return res.status(404).json({ message: "Not Found" });
//         }
//
//         const newTrans = new Transaction({
//             amt_in_out: "IN",
//             amount,
//             description: data.payment_status === "Paid" ? `BOX_CRICKET_${data.name}` : `ADV_BOX_CRICKET_${data.name}`,
//             balance_before_transaction: balanceBefore,
//             method: payment_method,
//             balance_after_transaction: balanceAfter,
//             identification: `BOX_CRICKET_${data._id.toHexString()}`,
//             institute: instituteId,
//             institute_name: institute.name,
//             user: userid
//         });
//         await newTrans.save();
//         await data.save();
//
//         log(`SUCCESSFULLY_MARKED_PAID_${id}_${amount}`);
//         return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
//     } catch (error) {
//         log(`ERROR_MARKING_PAID_${id || 'UNKNOWN'}`);
//         console.error(error);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// });
//
// // Fetch all bookings
// router.post('/get-all-bookings', async (req, res) => {
//     try {
//         const { instituteId } = req.body;
//         log(`FETCH_ALL_BOX_BOOKINGS`);
//
//         const query = instituteId && instituteId.trim() !== "" ? { institute: instituteId } : {};
//         if (instituteId && !query.institute) {
//             return res.status(400).json({ message: "Invalid instituteId" });
//         }
//         const data = await Turf.find();
//         return res.status(200).json(data);
//     } catch (error) {
//         log(`ERROR_FETCHING_BOX_BOOKINGS`);
//         console.error(error);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// });
//
// // Fetch all plans (merged from new code's /plans GET route)
// router.post('/plans', async (req, res) => {
//     try {
//         log(`FETCHING_ALL_BOX_PLANS`);
//         const data = await DetailsTG.find({ active: true });
//         return res.status(200).json(data);
//     } catch (err) {
//         log(`ERROR_FETCHING_BOX_PLANS`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// });
//
// // Add a new plan
// router.post("/add-plan",async (req,res)=>{
//     try{
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
// // Edit a plan
// router.post('/edit-plan', async (req, res) => {
//     try {
//         const { userid, _id: planid, name, amount, time_hr, time_min, category, sport, from, to, active } = req.body;
//         log(`EDITING_PLAN_${planid}_BY_${userid}`);
//
//         const updatedPlan = await DetailsTG.findByIdAndUpdate(
//             planid,
//             { name, amount, time_hr, time_min, category, sport, from, to, active },
//             { new: true }
//         );
//
//         if (!updatedPlan) {
//             log(`PLAN_NOT_FOUND_${planid}`);
//             return res.status(404).json({ message: "Plan not found" });
//         }
//
//         log(`SUCCESSFULLY_EDITED_PLAN_${planid}`);
//         return res.status(200).json({ message: "Plan successfully updated", updatedPlan });
//     } catch (err) {
//         log(`ERROR_EDITING_PLAN_${planid || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// });
//
// // Routes from new code (TurfBookingController)
// router.get('/details', async (req, res) => {
//     try {
//         log(`FETCHING_DEFAULT_ONE_HOUR_PRICE`);
//         const result = await DetailsTG.find({ time_hr: 1, time_min: 0, active: true, category: 'TURF', sport: 'Cricket' });
//         res.status(200).json(result);
//     } catch (error) {
//         log(`ERROR_FETCHING_DEFAULT_PRICE`);
//         console.error('Error fetching default price:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
//
// router.get('/upcoming-bookings', async (req, res) => {
//     try {
//         log(`FETCHING_UPCOMING_BOOKINGS`);
//         const currentDate = new Date();
//         const bookings = await Turf.find({ start_date: { $gt: currentDate }, status: true }).select('start_date end_date');
//         res.status(200).json(bookings);
//     } catch (error) {
//         log(`ERROR_FETCHING_UPCOMING_BOOKINGS`);
//         console.error('Error fetching upcoming bookings:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
//
// // Note: getActiveDetailsTurf and getImages are not included as they depend on Status and Images models not present in the old code
//
// module.exports = router;

const express = require('express');
const DetailsTG = require("../models/DetailsTurfGround");
const router = express.Router();
const Turf = require("../models/Turf");
const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const User = require("../models/user");
const Institute = require("../models/Institute");
const { log } = require("../Logs/logs");

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            // log(`AUTHORIZATION_HEADER_MISSING_${req.path}`);
            console.log(`Authorization header missing in ${req.path}`);
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const userId = authHeader.split(' ')[1];
        if (!userId) {
            // log(`USER_ID_MISSING_IN_AUTH_${req.path}`);
            console.log(`User ID not provided in Authorization header in ${req.path}`);
            return res.status(401).json({ message: "User ID not provided in authorization" });
        }

        const user = await User.findById(userId);
        if (!user) {
            // log(`USER_NOT_FOUND_${userId}`);
            console.log(`User not found for ID: ${userId} in ${req.path}`);
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Manager" && user.role !== "Admin") {
            // log(`UNAUTHORIZED_ROLE_${user.role}_${userId}`);
            console.log(`Unauthorized role: ${user.role} for user ID: ${userId} in ${req.path}`);
            return res.status(403).json({ message: "Unauthorized: Only Managers or Admins allowed" });
        }

        req.user = user;
        next();
    } catch (error) {
        // log(`AUTH_ERROR_${req.path}_${error.message}`);
        console.error(`Error in authentication middleware for ${req.path}:`, error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

router.use(authenticateUser);

router.post('/book', async (req, res) => {
    try {
        const {
            name,
            mobile_no,
            advance,
            start_date,
            end_date,
            payment_status,
            plan_id,
            payment_method,
            amount,
            instituteId
        } = req.body;

        log(`BOOKING_ATTEMPT_${name}_${instituteId}`);

        if (!instituteId || typeof instituteId !== 'string' || instituteId.trim() === "") {
            log(`INVALID_INSTITUTE_ID_${instituteId}`);
            return res.status(400).json({ message: "Invalid or missing instituteId" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const bookedBy = req.user.role === "Manager" ? "Manager" : "Admin";
        const turfData = {
            userid: req.user._id,  // For the userid field
            user_id: req.user._id, // For the user_id field
            name,
            mobile_no,
            booked_by: bookedBy,
            start_date,
            end_date,
            amount,
            payment_method,
            payment_status,
            status: true,
            plan_id,
            institute: instituteId,
            institute_name: institute.name,
            advance: Number(advance)
        };

        const data = new Turf(turfData);

        if (payment_status === "Paid") {
            data.leftover = 0;
            await data.save();

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount,
                description: `BOX_CRICKET_${name}`,
                method: payment_method,
                identification: `BOX_CRICKET_${data._id.toHexString()}`,
                institute: instituteId,
                institute_name: institute.name,
                user: req.user._id
            });
            await newTrans.save();
            log(`BOOKING_SUCCESSFUL_PAID_${data._id}`);
            return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
        } else if (payment_status === "Partial" || (payment_status === "Pending" && Number(advance) > 0)) {
            data.leftover = Number(amount) - Number(advance);
            data.payment_status = "Partial";
            await data.save();

            if (Number(advance) > 0) {
                const newTrans = new Transaction({
                    amt_in_out: "IN",
                    amount: advance,
                    description: `ADV_BOX_CRICKET_${name}`,
                    method: payment_method,
                    identification: `BOX_CRICKET_${data._id.toHexString()}`,
                    institute: instituteId,
                    institute_name: institute.name,
                    user: req.user._id
                });
                await newTrans.save();
            }
            log(`BOOKING_SUCCESSFUL_PARTIAL_${data._id}`);
            return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
        } else if (payment_status === "Pending") {
            data.leftover = Number(amount);
            await data.save();
            log(`BOOKING_SUCCESSFUL_PENDING_${data._id}`);
            return res.status(200).json({ message: "SUCCESSFULLY BOOKED" });
        } else {
            log(`INVALID_PAYMENT_STATUS_${payment_status}`);
            return res.status(400).json({ message: "Invalid payment_status" });
        }
    } catch (err) {
        log(`ERROR_BOOKING_BOX_CRICKET_${err.message}`);
        console.error("Error in /book:", err);
        return res.status(500).json({ message: "SERVER ERROR", error: err.message });
    }
});

router.post('/update', async (req, res) => {
    try {
        const { name, mobile_no, status, played, id, amount, instituteId } = req.body;
        log(`UPDATING_BOX_BOOKING_${id}`);

        const data = await Turf.findById(id);
        if (!data) {
            log(`TURF_NOT_FOUND_${id}`);
            return res.status(404).json({ message: "Turf not found" });
        }

        if (instituteId) {
            if (typeof instituteId !== 'string' || instituteId.trim() === "") {
                log(`INVALID_INSTITUTE_ID_UPDATE_${instituteId}`);
                return res.status(400).json({ message: "Invalid instituteId" });
            }
            const institute = await Institute.findById(instituteId);
            if (!institute) {
                log(`INSTITUTE_NOT_FOUND_UPDATE_${instituteId}`);
                return res.status(404).json({ message: "Institute not found" });
            }
            if (data.institute.toString() !== instituteId) {
                data.institute = instituteId;
                data.institute_name = institute.name;
            }
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
            data.amount += amount;
            if (data.leftover === 0) {
                data.payment_status = "Paid";
            }
        }

        await data.save();
        log(`SUCCESSFULLY_UPDATED_BOX_BOOKING_${id}`);
        return res.status(200).json({ message: "Turf updated successfully", data });
    } catch (error) {
        log(`ERROR_UPDATING_BOX_CRICKET_${error.message}`);
        console.error("Error updating turf:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/mark-as-paid', async (req, res) => {
    try {
        const { amount, id, payment_method, instituteId } = req.body;
        log(`MARK_AS_PAID_ATTEMPT_${id}_${amount}`);

        if (!instituteId || typeof instituteId !== 'string' || instituteId.trim() === "") {
            log(`INVALID_INSTITUTE_ID_PAYMENT_${instituteId}`);
            return res.status(400).json({ message: "Invalid or missing instituteId" });
        }

        const data = await Turf.findById(id);
        if (!data || data.payment_status === "Paid") {
            log(`TURF_NOT_FOUND_OR_PAID_${id}`);
            return res.status(404).json({ message: "Not Found or Already Paid" });
        }

        if (data.institute.toString() !== instituteId) {
            log(`INSTITUTE_MISMATCH_${instituteId}`);
            return res.status(400).json({ message: "Institute mismatch" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_PAYMENT_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        if (Number(amount) <= 0) {
            log(`INVALID_AMOUNT_${amount}`);
            return res.status(403).json({ message: "INVALID AMOUNT" });
        }

        if (data.payment_status === "Pending" && Number(amount) > 0) {
            data.payment_status = "Partial";
        }

        if (Number(amount) === data.leftover) {
            data.payment_status = "Paid";
            data.leftover = 0;
            await data.save();

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount,
                description: `BOX_CRICKET_${data.name}`,
                method: payment_method,
                identification: `BOX_CRICKET_${data._id.toHexString()}`,
                institute: instituteId,
                institute_name: institute.name,
                user: req.user._id
            });
            await newTrans.save();
            log(`PAYMENT_COMPLETED_${id}`);
            return res.status(200).json({ message: "SUCCESSFULLY PAID" });
        } else if (Number(amount) < data.leftover) {
            data.leftover = Number(data.leftover) - Number(amount);
            await data.save();

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount,
                description: `ADV_BOX_CRICKET_${data.name}`,
                method: payment_method,
                identification: `BOX_CRICKET_${data._id.toHexString()}`,
                institute: instituteId,
                institute_name: institute.name,
                user: req.user._id
            });
            await newTrans.save();
            log(`PARTIAL_PAYMENT_${id}_${amount}`);
            return res.status(200).json({ message: "PARTIALLY PAID" });
        } else {
            log(`AMOUNT_EXCEEDS_LEFTOVER_${id}_${amount}`);
            return res.status(400).json({ message: "Amount exceeds leftover" });
        }
    } catch (error) {
        log(`ERROR_MARKING_PAID_${error.message}`);
        console.error("Error marking as paid:", error);
        return res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
});
router.post('/get-all-bookings', async (req, res) => {
    try {
        const { instituteId } = req.body;
        log(`FETCHING_ALL_BOOKINGS_${instituteId || 'ALL'}`);

        const query = instituteId && instituteId.trim() !== "" ? { institute: instituteId } : {};
        if (instituteId && !query.institute) {
            log(`INVALID_INSTITUTE_ID_FETCH_${instituteId}`);
            return res.status(400).json({ message: "Invalid instituteId" });
        }
        const data = await Turf.find(query);
        log(`SUCCESSFULLY_FETCHED_BOOKINGS_${data.length}`);
        return res.status(200).json(data);
    } catch (error) {
        log(`ERROR_FETCHING_BOOKINGS_${error.message}`);
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
});

router.post('/plans', async (req, res) => {
    try {
        log(`FETCHING_ACTIVE_PLANS`);
        const data = await DetailsTG.find({ active: true });
        log(`SUCCESSFULLY_FETCHED_PLANS_${data.length}`);
        return res.status(200).json(data);
    } catch (err) {
        log(`ERROR_FETCHING_PLANS_${err.message}`);
        console.error("Error in /plans:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/add-plan", async (req, res) => {
    try {
        const { name, amount, time_hr, time_min, category, sport, from, to } = req.body;
        log(`ADDING_PLAN_${name}`);

        const data = new DetailsTG({ name, amount, time_hr, time_min, category, sport, from, to });
        await data.save();

        log(`SUCCESSFULLY_ADDED_PLAN_${name}`);
        return res.status(200).json({ message: "PLAN ADDED SUCCESSFULLY" });
    } catch (err) {
        log(`ERROR_ADDING_PLAN_${err.message}`);
        console.error("Error in /add-plan:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/edit-plan", async (req, res) => {
    try {
        const { id, name, amount, time_hr, time_min, category, sport, from, to, active } = req.body;
        log(`EDITING_PLAN_${id}`);

        if (!id) {
            log(`PLAN_ID_MISSING`);
            console.log("Plan ID missing in /edit-plan request");
            return res.status(400).json({ message: "Plan ID is required" });
        }

        const plan = await DetailsTG.findById(id);
        if (!plan) {
            log(`PLAN_NOT_FOUND_${id}`);
            console.log(`Plan not found for ID: ${id} in /edit-plan`);
            return res.status(404).json({ message: "Plan not found" });
        }

        if (name !== undefined) plan.name = name;
        if (amount !== undefined) plan.amount = amount;
        if (time_hr !== undefined) plan.time_hr = time_hr;
        if (time_min !== undefined) plan.time_min = time_min;
        if (category !== undefined) plan.category = category;
        if (sport !== undefined) plan.sport = sport;
        if (from !== undefined) plan.from = from;
        if (to !== undefined) plan.to = to;
        if (active !== undefined) plan.active = active;

        await plan.save();
        log(`SUCCESSFULLY_UPDATED_PLAN_${id}`);
        return res.status(200).json({ message: "PLAN UPDATED SUCCESSFULLY", data: plan });
    } catch (err) {
        log(`ERROR_EDITING_PLAN_${err.message}`);
        console.error("Error in /edit-plan:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;