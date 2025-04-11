const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const Staff = require("../models/Staff");
const Sport = require('../models/Sport');
const { log } = require("../Logs/logs")

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

// Get All Staff
const getAllStaff = async (req, res) => {
    try {
        //console.log(1)
        const { userid } = req.body;
        log(`FETCH_ALL_STAFF_${userid}`);
//console.log(userid)
        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        //console.log("> ",manager)
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const staffList = await Staff.find({ delete: false });
        return res.status(200).json(staffList);
    } catch (err) {
        log(`ERROR_FETCHING_STAFF`);
        console.error("Error fetching staff:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Add New Staff
const addNewStaff = async (req, res) => {
    try {
        upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { userid, role, name, address, phone, dob, sport_id } = req.body;
            log(`ADDING_NEW_STAFF_${userid}_${name}`);

            // Validate manager
            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }

            // Validate sport
            const sportDetails = await Sport.findById(sport_id);
            if (!sportDetails) {
                log(`SPORT_NOT_FOUND_${sport_id}`);
                return res.status(404).send("Sport not found");
            }

            // Generate roll_no
            const rollno = await Staff.countDocuments({ role });
            const prefix = role === "Staff" ? "STA" : role === "Coach" ? "COA" : "UNK";
            const roll_no = `${prefix}${String(rollno + 25001)}`;

            // Handle photo upload
            let photoFilename = "";
            if (req.files && req.files.photo) {
                photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
                fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
            }

            const newStaff = new Staff({
                name,
                role,
                roll_no,
                address,
                photo: photoFilename,
                phone,
                dob,
                sport_id,
                user_id: userid
            });

            await newStaff.save();
            log(`ADDED_NEW_STAFF_SUCCESSFULLY_${newStaff._id.toHexString()}`);
            return res.status(200).json(newStaff);
        });
    } catch (err) {
        log(`ERROR_ADDING_STAFF`);
        console.error("Error adding staff:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const editStaff = async (req, res) => {
    try {
        upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { userid, rollno, role, name, address, phone, dob, sport_id } = req.body;
            log(`EDITING_STAFF_${rollno}_${userid}`);

            // Validate manager
            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }

            // Find staff by ID (not rollno, assuming rollno in body is actually the staff _id)
            const staff = await Staff.findById(rollno);
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }

            // Parse sport_id (expecting an array or single value)
            let sportIds = sport_id
                ? Array.isArray(sport_id)
                    ? sport_id
                    : [sport_id]
                : staff.sport_id; // Keep existing sports if not provided
            if (sportIds.length === 0) {
                log(`NO_SPORTS_PROVIDED_${rollno}`);
                return res.status(400).json({ message: "At least one sport must be selected" });
            }

            // Validate all sport IDs
            const sportDetails = await Sport.findById(sport_id);
            if (!sportDetails) {
                log(`SPORT_NOT_FOUND_${sport_id}`);
                return res.status(404).send("Sport not found");
            }

            // Handle photo upload
            let photoFilename = staff.photo;
            if (req.files && req.files.photo) {
                photoFilename = `${staff.roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
                fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
            }

            // Update staff fields
            staff.name = name || staff.name;
            staff.role = role || staff.role;
            staff.address = address || staff.address;
            staff.phone = phone || staff.phone;
            staff.dob = dob || staff.dob;
            staff.sport_id = sportIds; // Update sport IDs
            staff.photo = photoFilename;

            await staff.save();
            log(`EDITED_STAFF_SUCCESSFULLY_${rollno}`);
            return res.status(200).json({ message: "SUCCESSFULLY UPDATED" });
        });
    } catch (err) {
        log(`ERROR_EDITING_STAFF`);
        console.error("Error editing staff:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
const deleteStaff  = async (req,res) =>{
    try{
        const { userid,id } = req.body;
        log(`DELETED_STAFF_${id}_BY_${userid}`);
        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const resp=await Staff.findById(id);
        resp.delete=true;
        resp.save();
        log(`DELETED_SUCCESSFULLY_${resp.roll_no}`);
        res.status(200).json({message:"SUCCESSFULLY DELETED"})

    } catch (err) {
        log(`ERROR_DELETING_STAFF`);
        console.error("Error deleting staff:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getAllStaff, addNewStaff,editStaff ,deleteStaff};
