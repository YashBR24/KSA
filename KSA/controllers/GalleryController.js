const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const { log } = require("../Logs/logs")
const Event = require("../models/Images");
// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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
            cb(new Error("Only images are allowed"));
        }
    },
});

// Get All Events
const getAllImages = async (req, res) => {
    try {
        const { userid } = req.body;
        log(`FETCH_ALL_GALLERY_IMAGES`);
        // Check if user is a manager
        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            //console.log("Not Found");
            return res.status(404).json({ message: "Manager not found" });
        }

        // Fetch all events
        const eventList = await Event.find({ delete: false });

        return res.status(200).json(eventList);
    } catch (err) {
        log(`ERROR_FETCHING_GALLERY_IMAGES`);
        console.error("Error fetching Image:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Add New Event
const addNewImage = async (req, res) => {
    try {
        upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { userid, title, description } = req.body;
            log(`ADDING_NEW_GALLERY_IMAGE_${title}_${userid}`);
            const manager = await User.findById(userid);
            if (!manager || manager.role!=="Manager") {
                //console.log("Not Found")
                return res.status(404).json({ message: "Manager not found" });
            }

            const rollno = await Event.countDocuments({});
            const roll_no = `IMAGE${String(rollno + 25001)}`;

            let photoFilename = "";
            if (req.files && req.files.photo) {
                photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
                fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
            }

            const newEvent = new Event({
                data:photoFilename, title,description,uploadedBy:'Manager'
            });

            await newEvent.save();
            return res.status(201).json(newEvent);
        });
    } catch (err) {
        log(`ERROR_ADDING_IMAGES`);
        console.error("Error adding Image:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update Status to True
const updateStatus = async (req, res) => {
    try {
        const { imgid:eventid, userid ,status1:status} = req.body;
        //console.log(req.body)
        log(`UPDATING_IMAGE_STATUS_${eventid}_${userid}`);
        //console.log("Changing to : ",status)

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const event = await Event.findById(eventid);
        
        if (!event) {
            return res.status(404).json({ message: "Image not found" });
        }
        event.active = status;
        event.delete = false;
        await event.save();
        //console.log(event)
        //console.log("Changed")
        return res.status(200).json({ message: "Image status updated to "+status });
    } catch (err) {
        log(`ERROR_UPDATING_IMAGE_STATUS`);
        console.error("Error updating Image status:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


// Delete Event
const deleteImage = async (req, res) => {
    try {
        const { imgid:eventid, userid } = req.body;
        log(`DELETING_IMAGE_${eventid}_${userid}`);
        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const event = await Event.findById(eventid);
        if (!event) {
            return res.status(404).json({ message: "Image not found" });
        }

        event.delete = true;
        await event.save();

        return res.status(200).json({ message: "Image deleted successfully" });
    } catch (err) {
        log(`ERROR_DELETING_IMAGE`);
        console.error("Error deleting Image:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllImages, addNewImage,updateStatus, deleteImage };
