const Image = require('../models/Images'); // Model to store image details
// const Booking = require('../models/Booking'); // Model for booking requests
const Queries = require('../models/Queries');
const Events = require('../models/Events');
const User = require('../models/user');
const DetailsTG=require('../models/DetailsTurfGround');
const { log } = require("../Logs/logs")
const GroundImg = require('../models/GroundImages');
const Status=require('../models/Status');
const TurfImg=require('../models/TurfImages');

const Registration = require('../models/eventRegistration');
const { verifyRecaptcha } = require('../utils/recaptcha');
// Get images uploaded by admin and coaches

exports.getEvents = async (req, res) => {
    try {
        log(`FETCHING_EVENTS`);
        // Fetch images where the active field is true
        const images = await Events.find({ status: true }).sort({createdAt:-1}); // Ensure we only fetch active images
        res.json(images.map(img => ({
            id: img._id,
            name: img.name,
            contentType: img.contentType,
            data: img.event_logo.toString('base64'),  // Convert binary data to base64 string
            event_date: img.event_date,
            location: img.location,
            event_fee: img.event_fee
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images' });
    }
}

exports.newQueries = async (req, res) => {
    log(`VERIFYING_RECAPTCHA`);
    const {recaptchaToken}=req.body;
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
    try{
        const {name,email,mobile,description}= req.body;
        const newQuery=Queries({name,email,mobile_no:mobile,description});
        await newQuery.save();
        log(`NEW_QUERY_${email}`);
        res.status(200).json({"STATUS":"SUCCESSFULLY INSERTED QUERY"})
    }
    catch(err){
        res.status(400).send({"ERROR":"NOT COMPLETED"})
    }
}

exports.newEventRegistration = async (req, res) => {
    try {
        const { name, email, phone, event_id,user_id } = req.body;
        //console.log(event_id);
        log(`NEW_EVENT_REGISTRATION_${email}`);
        // Find the event by ID
        const event = await Events.findById(event_id);
        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Create a new registration
        const newQuery = new Registration({
            name,
            email,
            mobile_no: phone,
            event_id: event_id,
            user_id:user_id
        });
        log(`REGISTERED_FOR_EVENT_${event_id}_BY_${email}`);
        // Save the new registration
        await newQuery.save();

        res.status(200).json({ "STATUS": "SUCCESSFULLY INSERTED QUERY" });
    } catch (err) {
        log(`ERROR_IN_EVENT_REGISTRATION`);
        console.error(err);  // Log the error to see details
        res.status(400).json({ "ERROR": "NOT COMPLETED" });
    }
};
exports.getImages = async (req, res) => {
    try {
        log(`FETCHING_IMAGES`);
        // Fetch images where the active field is true
        const images = await Image.find({ active: true }).sort({uploadedAt:-1}).limit(5); // Ensure we only fetch active images
        res.json(images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            contentType: img.contentType,
            data: img.data.toString('base64')  // Convert binary data to base64 string
        })));
    } catch (error) {
        log(`ERROR_FETCHING_IMAGES`);
        res.status(500).json({ message: 'Error fetching images' });
    }
};
exports.getAllImages = async (req, res) => {
    try {
        log(`GET_ALL_IMAGES`);
        // Fetch images where the active field is true
        const images = await Image.find({ active: true }).sort({uploadedAt:-1}); // Ensure we only fetch active images
        res.status(200).json(images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            contentType: img.contentType,
            data: img.data.toString('base64')  // Convert binary data to base64 string
        })));
    } catch (error) {
        log(`ERROR_FETCHING_IMAGES`);
        //console.log(error)
        res.status(500).json({ message: 'Error fetching images' });
    }
};

// Handle booking requests
exports.bookItem = async (req, res) => {
    const { type } = req.body;

    // Validate booking type
    if (!['turf', 'admission', 'ground'].includes(type)) {
        return res.status(400).json({ message: 'Invalid booking type' });
    }

    try {
        // Create new booking
        const newBooking = new Booking({ type, userId: req.user.id });
        await newBooking.save();

        res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} booked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Booking failed' });
    }
};
