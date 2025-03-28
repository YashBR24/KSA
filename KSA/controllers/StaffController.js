const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const Staff = require("../models/Staff");
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

            const { userid, role, name, address, phone, dob } = req.body;
            log(`ADDING_NEW_STAFF_${userid}_${name}`);
            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }

            const rollno = await Staff.countDocuments({ role });
            const prefix = role === "Staff" ? "STA" : role === "Coach" ? "COA" : "UNK";
            const roll_no = `${prefix}${String(rollno + 25001)}`;

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

            const { userid,rollno, role, name, address, phone, dob } = req.body;
            log(`EDITING_STAFF_${rollno}_${userid}`);
            //console.log(rollno,role,name,address,phone,dob)
            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }

            let photoFilename = "";
            if (req.files && req.files.photo) {
                photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
                fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
            }

            const mem1= await Staff.findById(rollno);
            if (!mem1){
                return res.status(404).json({ message: "Manager not found" });
            }
            //console.log(mem1)
            mem1.name=name || mem1.name;
            mem1.role=role || mem1.role;
            mem1.address=address ||mem1.address;
            if (photoFilename){
                mem1.photo= photoFilename
            }
            mem1.phone=phone|| mem1.phone;
            mem1.dob=dob || mem1.dob;
            await mem1.save();
            log(`EDITED_STAFF_SUCCESSFULLY_${rollno}`);
            return res.status(200).json({message:"SUCCESSFULLY UPDATED"})
        });
    } catch (err) {
        log(`ERROR_EDITING_STAFF`);
        console.error("Error adding staff:", err);
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
