// const DetailsTG = require('../models/DetailsTurfGround');
// const Status=require('../models/Status');
// const CryptoJS = require('crypto-js');
// const Images = require('../models/TurfImages');
// const TurfBooking = require('../models/Turf');
// const { log } = require("../Logs/logs")
// const jwt = require('jsonwebtoken');
// // Controller function to fetch default 1-hour price for time ranges
// const getDefaultOneHourPrice = async (req, res) => {
//     try {
//         log(`FETCHING_PRICES_ONE_HR_FOR_TURF`);
//         const result = await DetailsTG.find({time_hr: 1,time_min:0, active: true ,category:'TURF',sport:'Cricket'});
//         res.status(200).json(result);
//     } catch (error) {
//         log(`ERROR_FETCHING_TURF_PRICES`);
//         console.error('Error fetching default price:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// const getUpcomingBookings = async (req, res) => {
//     try {
//         log(`FETCHING_TURF_UPCOMING_BOOKING`);
//         const currentDate = new Date();
//
//         // Fetch only selected fields: `_id`, `name`, `booked_by`, `start_date`, `end_date`
//         const bookings = await TurfBooking.find(
//             { start_date: { $gt: currentDate } }
//         ).select('start_date end_date');
//
//         res.status(200).json(bookings);
//     } catch (error) {
//         log(`ERROR_FETCHING_UPCOMING_BOOKING`);
//         console.error('Error fetching upcoming bookings:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
//
//
// const getDetailsPrice = async (req, res) => {
//     try {
//         log(`FETCHING_PLANS_FOR_TURF`);
//         const result = await DetailsTG.find({ active: true ,category:'TURF',sport:'Cricket'});
//         res.status(200).json(result);
//     } catch (error) {
//         log(`ERROR_FETCHING_PLANS_TURF`);
//         console.error('Error fetching default price:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// const getActiveDetailsTurf = async (req, res) => {
//     try {
//         log(`FETCH_TURF_ACTIVE_STATUS`);
//         const result = await Status.findOne({ name: 'TURF' }); // Use findOne to get a single document
//         let status;
//
//         if (result && result.active) {  // Check if result exists and active is true
//             status = "ACTIVE";
//         } else {
//             status = "INACTIVE";
//         }
//
//         // //console.log("Backend Status:", status);  // Log status before encryption
//         const data = CryptoJS.AES.encrypt(status.toString(), "FetchTurfActiveStatus").toString();
//         // //console.log("Encrypted Status:", data);  // Log encrypted status
//
//         res.status(200).json({ "acstatus": data });  // Ensure the response has acstatus
//     } catch (error) {
//         log(`ERROR_FETCHING_TURF_ACTIVE_STATUS`);
//         console.error('Error Fetching Status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
//
// const getImages = async (req, res) => {
//     try {
//         log(`FETCHING_TURF_IMAGES`);
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
//         log(`ERROR_FETCHING_IMAGES`);
//         res.status(500).json({ message: 'Error fetching images' });
//     }
// };
//
// const BookTurf=async (req,res) =>{
//     try{
//         let {plan_id,user_id,booking_form,booked_by,token}=req.body;
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifies the signature
//         const { id, email, mobile } = decodedToken; // Extract relevant fields from the token
//
//         plan_id = CryptoJS.AES.decrypt(
//             plan_id,
//             "71f51aa9785d29a3b1d4a76e9f32c4a908a914e5cdb6f20a5e362cd4bbd86b7f400f6c1820a97856b7f400fef12ab08c7f630ec15b3d866a148634b43dfe3dc1820a978564e896db2"
//         ).toString(CryptoJS.enc.Utf8);
//         // Optional: You can validate the extracted user ID with `user_id` if needed
//         if (id !== user_id) {
//             return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
//         }
//     }
//     catch (error){
//         res.status(500).json({ message: 'Error fetching images' });
//     }
// }
//
//
// module.exports = { BookTurf,getUpcomingBookings,getActiveDetailsTurf,getDefaultOneHourPrice,getDetailsPrice ,getImages};


const DetailsTG = require('../models/DetailsTurfGround');
const Status = require('../models/Status');
const CryptoJS = require('crypto-js');
const Images = require('../models/TurfImages');
const TurfBooking = require('../models/Turf');
const jwt = require('jsonwebtoken');
const Institute = require('../models/Institute');
const { log } = require("../Logs/logs");

const getDefaultOneHourPrice = async (req, res) => {
    try {
        log(`FETCHING_PRICES_ONE_HR_FOR_TURF`);
        const result = await DetailsTG.find({ time_hr: 1, time_min: 0, active: true, category: 'TURF', sport: 'Cricket' });
        res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_TURF_PRICES`);
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUpcomingBookings = async (req, res) => {
    try {
        log(`FETCHING_TURF_UPCOMING_BOOKING`);
        const currentDate = new Date();
        const bookings = await TurfBooking.find(
            { start_date: { $gt: currentDate }, status: true }
        ).select('start_date end_date');
        res.status(200).json(bookings);
    } catch (error) {
        log(`ERROR_FETCHING_UPCOMING_BOOKING`);
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDetailsPrice = async (req, res) => {
    try {
        log(`FETCHING_PLANS_FOR_TURF`);
        const result = await DetailsTG.find({ active: true, category: 'TURF', sport: 'Cricket' });
        res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_PLANS_TURF`);
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getActiveDetailsTurf = async (req, res) => {
    try {
        log(`FETCH_TURF_ACTIVE_STATUS`);
        const result = await Status.findOne({ name: 'TURF' });
        let status = (result && result.active) ? "ACTIVE" : "INACTIVE";
        const data = CryptoJS.AES.encrypt(status.toString(), "FetchTurfActiveStatus").toString();
        res.status(200).json({ "acstatus": data });
    } catch (error) {
        log(`ERROR_FETCHING_TURF_ACTIVE_STATUS`);
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getImages = async (req, res) => {
    try {
        log(`FETCHING_TURF_IMAGES`);
        const images = await Images.find({ active: true }).sort({ uploadedAt: -1 }).limit(5);
        res.json(images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            contentType: img.contentType,
            data: img.data.toString('base64')
        })));
    } catch (error) {
        log(`ERROR_FETCHING_IMAGES`);
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
};

const BookTurf = async (req, res) => {
    try {
        const { plan_id: encryptedPlanId, user_id, booking_form, booked_by, token, instituteId, payment_method } = req.body;
        log(`BOOKING_TURF_${booking_form?.name || 'UNKNOWN'}_${user_id}`);

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = decodedToken;

        if (id !== user_id) {
            log(`UNAUTHORIZED_USER_MISMATCH_${user_id}`);
            return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
        }

        let plan_id;
        try {
            plan_id = CryptoJS.AES.decrypt(
                encryptedPlanId,
                "71f51aa9785d29a3b1d4a76e9f32c4a908a914e5cdb6f20a5e362cd4bbd86b7f400f6c1820a97856b7f400fef12ab08c7f630ec15b3d866a148634b43dfe3dc1820a978564e896db2"
            ).toString(CryptoJS.enc.Utf8);
        } catch (decryptionError) {
            log(`PLAN_ID_DECRYPTION_FAILED_${encryptedPlanId}`);
            return res.status(400).json({ message: 'Invalid plan ID' });
        }

        const plan = await DetailsTG.findById(plan_id);
        if (!plan) {
            log(`PLAN_NOT_FOUND_${plan_id}`);
            return res.status(404).json({ message: "Plan not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const newBooking = new TurfBooking({
            name: booking_form.name || `Turf Booking ${new Date().toISOString()}`,
            mobile_no: booking_form.mobile_no,
            booked_by,
            start_date: booking_form.start_date,
            end_date: booking_form.end_date,
            amount: plan.price,
            payment_method: payment_method || 'CASH',
            payment_status: 'Pending',
            user_id,
            plan_id,
            leftover: plan.price,
            institute: instituteId,
            institute_name: institute.name
        });

        await newBooking.save();
        log(`TURF_BOOKED_SUCCESSFULLY_${newBooking._id.toHexString()}`);
        res.status(201).json({ message: "Turf booked successfully", booking: newBooking });
    } catch (error) {
        log(`ERROR_BOOKING_TURF_${user_id || 'UNKNOWN'}`);
        console.error("Error booking turf:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { BookTurf, getUpcomingBookings, getActiveDetailsTurf, getDefaultOneHourPrice, getDetailsPrice, getImages };