// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const User = require("../models/user");
// const Event = require("../models/Events");
// const { log } = require("../Logs/logs")
//
// // Multer Storage Config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });
//
// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         if (extname) {
//             cb(null, true);
//         } else {
//             cb(new Error("Only images are allowed"));
//         }
//     },
// });
//
// // Get All Events
// // const getAllEvents = async (req, res) => {
// //     try {
// //         const { userid } = req.body;
//
// //         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
// //         if (!manager) {
// //             //console.log("Not Found")
// //             return res.status(404).json({ message: "Manager not found" });
// //         }
//
// //         const eventList = await Event.find({ delete: false });
// //         return res.status(200).json(eventList);
// //     } catch (err) {
// //         console.error("Error fetching events:", err);
// //         return res.status(500).json({ message: "Server error" });
// //     }
// // };
//
// const getAllEvents = async (req, res) => {
//     try {
//         const { userid } = req.body;
//         log(`FETCHING_ALL_EVENTS`);
//
//         // Check if user is a manager
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             //console.log("Not Found");
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         // Fetch all events
//         const eventList = await Event.find({ delete: false });
//
//         // Get counts for each event from another table
//         const eventCounts = await Promise.all(
//             eventList.map(async (event) => {
//                 const count = await EventParticipants.countDocuments({ event_id: new mongoose.Types.ObjectId(event._id) });
//                 return { ...event.toObject(), count };
//             })
//         );
//
//         return res.status(200).json(eventCounts);
//     } catch (err) {
//         log(`ERROR_FETCHING_EVENTS`);
//         console.error("Error fetching events:", err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };
//
//
// // Add New Event
// const addNewEvent = async (req, res) => {
//     try {
//         upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
//             if (err) return res.status(400).json({ message: err.message });
//
//             const { userid, event_date, event_fee, location, name } = req.body;
//             log(`ADDING_NEW_EVENT_${userid}_${name}`);
//             const manager = await User.findById(userid);
//             if (!manager || manager.role!=="Manager") {
//                 //console.log("Not Found")
//                 return res.status(404).json({ message: "Manager not found" });
//             }
//
//             const rollno = await Event.countDocuments({});
//             const roll_no = `EVENT${String(rollno + 25001)}`;
//
//             let photoFilename = "";
//             if (req.files && req.files.photo) {
//                 photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
//                 fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
//             }
//
//             const newEvent = new Event({
//                 event_date, event_fee, event_logo: photoFilename, location, name
//             });
//
//             await newEvent.save();
//             log(`SUCCESSFULLY_ADDED_NEW_EVENT_${newEvent._id.toHexString()}`);
//             return res.status(201).json(newEvent);
//         });
//     } catch (err) {
//         log(`ERROR_ADDING_NEW_EVENT`);
//         console.error("Error adding event:", err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };
//
// // Edit Event
// const editEvent = async (req, res) => {
//     try {
//         upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
//             if (err) return res.status(400).json({ message: err.message });
//
//             const { eventid, userid, event_date, event_fee, location, name } = req.body;
//             log(`EDITING_EVENT_${eventid}`);
//             const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//             if (!manager) {
//                 return res.status(404).json({ message: "Manager not found" });
//             }
//
//             const event = await Event.findById(eventid);
//             if (!event) {
//                 return res.status(404).json({ message: "Event not found" });
//             }
//
//             if (req.files && req.files.photo) {
//                 const photoFilename = `${eventid}_photo${path.extname(req.files.photo[0].originalname)}`;
//                 fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
//                 event.event_logo = photoFilename;
//             }
//
//             // Update other fields
//             event.event_date = event_date;
//             event.event_fee = event_fee;
//             event.location = location;
//             event.name = name;
//
//             await event.save();
//             log(`EDITED_EVENT_SUCCESSFULLY_${event._id.toHexString()}`);
//             return res.status(200).json({ message: "Event updated successfully" });
//         });
//     } catch (err) {
//         console.error("Error editing event:", err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };
//
// // Update Status to False
// const updateStatusToFalse = async (req, res) => {
//     try {
//         const { eventid, userid } = req.body;
//         log(`UPDATING_EVENT_STATUS_TO_FALSE_${eventid}`);
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         const event = await Event.findById(eventid);
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }
//
//         event.delete = false;
//         await event.save();
//
//         log(`UPDATED_EVENT_STATUS_TO_FALSE_${eventid}`);
//         return res.status(200).json({ message: "Event status updated to false" });
//     } catch (err) {
//
//         log(`ERROR_UPDATING_EVENT_STATUS`);
//         console.error("Error updating event status:", err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };
//
// // Delete Event
// const deleteEvent = async (req, res) => {
//     try {
//         const { eventid, userid } = req.body;
//         log(`DELETING_EVENT_${eventid}`);
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         const event = await Event.findById(eventid);
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }
//
//         event.delete = true;
//         await event.save();
//         log(`DELETED_EVENT_${event_id}`);
//         return res.status(200).json({ message: "Event deleted successfully" });
//     } catch (err) {
//         log(`ERROR_DELETING_EVENT`);
//         console.error("Error deleting event:", err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };
//
// const EventParticipants = require("../models/eventRegistration");
// const Balance = require("../models/Balance");
// const Transaction = require("../models/Transaction");
// const eventParticipants = async (req,res) =>{
//     try {
//         const {userid,eventid} = req.body;
//         log(`FETFCHING_EVENT_PARTICIPANTS_${eventid}`);
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         const participants= await EventParticipants.find({event_id: new mongoose.Types.ObjectId(eventid)})
//
//         return res.status(200).json(participants);
//     }
//     catch (err){
//         log(`ERROR_FETCHING_EVENT_PARTICIPANTS`);
//         console.error(err);
//         return res.status(500).json({message:"Server Error"})
//     }
// }
//
// const addEventParticipants = async (req,res) =>{
//     try {
//         const {userid,eventid,name,email,mobile_no,payment_method,amount} = req.body;
//         log(`ADDING_NEW_PARTICIPANTS_EVENT_${eventid}_${name}_${amount}_BY_${userid}`);
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         const newpart= new EventParticipants({
//             name,
//             email,
//             mobile_no,
//             payment_method,
//             payment_done:true,
//             amount,
//             event_id:eventid,
//         })
//         newpart.save();
//         const bal_id = "677ba181a9f86714ba5b860b"
//         const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//         if (!balance1) {
//             return res.status(404).json("Balance record not found");
//         }
//         const bal = balance1.balance;
//         let balance_after_transaction;
//         balance_after_transaction = Number(bal) + Number(amount);
//         const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount,
//                 description: "EVENT_REGISTRATION_"+ name,
//                 balance_before_transaction:bal,
//                 method: payment_method,
//                 balance_after_transaction,
//                 identification:"EVENT_REGISTRATION_"+newpart._id.toHexString()
//             })
//         newTrans.save();
//         balance1.balance=balance_after_transaction;
//         balance1.save();
//         log(`ADDED_SUCCESSFULLY_${newpart._id.toHexString()}`);
//         return res.status(200).json(newpart);
//
//     }catch (err){
//         console.error(err);
//         return res.status(500).json({message:"Server Error"})
//     }
// }
//
// module.exports = { getAllEvents, addNewEvent,addEventParticipants, editEvent,eventParticipants, updateStatusToFalse, deleteEvent };
//
//


const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const Event = require("../models/Events");
const EventParticipants = require("../models/eventRegistration");
const Transaction = require("../models/Transaction");
const Institute = require("../models/Institute");
const { log } = require("../Logs/logs");

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
const getAllEvents = async (req, res) => {
    try {
        const { userid, instituteId } = req.body;
        log(`FETCHING_ALL_EVENTS_${userid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const query = { delete: false };
        if (instituteId) {
            query.institute = new mongoose.Types.ObjectId(instituteId);
        }

        const eventList = await Event.find(query).populate("institute", "name");

        const eventCounts = await Promise.all(
            eventList.map(async (event) => {
                const count = await EventParticipants.countDocuments({ event_id: event._id });
                return { ...event.toObject(), count };
            })
        );

        return res.status(200).json(eventCounts);
    } catch (err) {
        log(`ERROR_FETCHING_EVENTS_${userid}`);
        console.error("Error fetching events:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Add New Event
const addNewEvent = async (req, res) => {
    try {
        upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { userid, event_date, event_fee, location, name, instituteId } = req.body;
            log(`ADDING_NEW_EVENT_${userid}_${name}`);

            const manager = await User.findById(userid);
            if (!manager || manager.role !== "Manager") {
                return res.status(404).json({ message: "Manager not found" });
            }

            const institute = await Institute.findById(instituteId);
            if (!institute) {
                return res.status(404).json({ message: "Institute not found" });
            }

            const rollno = await Event.countDocuments({});
            const roll_no = `EVENT${String(rollno + 25001)}`;

            let photoFilename = "";
            if (req.files && req.files.photo) {
                photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
                fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
            }

            const newEvent = new Event({
                event_date,
                event_fee,
                event_logo: photoFilename,
                location,
                name,
                institute: instituteId,
            });

            await newEvent.save();
            log(`SUCCESSFULLY_ADDED_NEW_EVENT_${newEvent._id.toHexString()}`);
            return res.status(201).json(newEvent);
        });
    } catch (err) {
        log(`ERROR_ADDING_NEW_EVENT_${userid}`);
        console.error("Error adding event:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Edit Event
const editEvent = async (req, res) => {
    try {
        upload.fields([{ name: "photo", maxCount: 1 }])(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { eventid, userid, event_date, event_fee, location, name, instituteId } = req.body;
            log(`EDITING_EVENT_${eventid}`);

            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }

            const event = await Event.findById(eventid);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            const institute = await Institute.findById(instituteId);
            if (!institute) {
                return res.status(404).json({ message: "Institute not found" });
            }

            if (req.files && req.files.photo) {
                const photoFilename = `${eventid}_photo${path.extname(req.files.photo[0].originalname)}`;
                fs.renameSync(req.files.photo[0].path, `uploads/${photoFilename}`);
                event.event_logo = photoFilename;
            }

            event.event_date = event_date;
            event.event_fee = event_fee;
            event.location = location;
            event.name = name;
            event.institute = instituteId;

            await event.save();
            log(`EDITED_EVENT_SUCCESSFULLY_${event._id.toHexString()}`);
            return res.status(200).json({ message: "Event updated successfully" });
        });
    } catch (err) {
        log(`ERROR_EDITING_EVENT_${eventid || 'UNKNOWN'}`);
        console.error("Error editing event:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update Status to False
const updateStatusToFalse = async (req, res) => {
    try {
        const { eventid, userid } = req.body;
        log(`UPDATING_EVENT_STATUS_TO_FALSE_${eventid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const event = await Event.findById(eventid);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.delete = false;
        await event.save();

        log(`UPDATED_EVENT_STATUS_TO_FALSE_${eventid}`);
        return res.status(200).json({ message: "Event status updated to false" });
    } catch (err) {
        log(`ERROR_UPDATING_EVENT_STATUS_${eventid || 'UNKNOWN'}`);
        console.error("Error updating event status:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete Event
const deleteEvent = async (req, res) => {
    try {
        const { eventid, userid } = req.body;
        log(`DELETING_EVENT_${eventid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const event = await Event.findById(eventid);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.delete = true;
        await event.save();
        log(`DELETED_EVENT_${eventid}`);
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        log(`ERROR_DELETING_EVENT_${eventid || 'UNKNOWN'}`);
        console.error("Error deleting event:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get Event Participants
const eventParticipants = async (req, res) => {
    try {
        const { userid, eventid } = req.body;
        log(`FETCHING_EVENT_PARTICIPANTS_${eventid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const participants = await EventParticipants.find({ event_id: new mongoose.Types.ObjectId(eventid) });

        return res.status(200).json(participants);
    } catch (err) {
        log(`ERROR_FETCHING_EVENT_PARTICIPANTS_${eventid || 'UNKNOWN'}`);
        console.error("Error fetching event participants:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Add Event Participants with Institute-Based Transaction
const addEventParticipants = async (req, res) => {
    try {
        const { userid, eventid, name, email, mobile_no, payment_method, amount } = req.body;
        log(`ADDING_NEW_PARTICIPANTS_EVENT_${eventid}_${name}_${amount}_BY_${userid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        const event = await Event.findById(eventid).populate("institute");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const newParticipant = new EventParticipants({
            name,
            email,
            mobile_no,
            payment_method,
            payment_done: true,
            amount,
            event_id: eventid,
        });
        await newParticipant.save();

        // Fetch previous transactions for the institute to calculate balance
        const previousTransactions = await Transaction.find({ institute: event.institute._id })
            .sort({ createdAt: -1 })
            .limit(1);
        const balanceBefore = previousTransactions.length > 0 ? previousTransactions[0].balance_after_transaction : 0;

        const balanceAfter = balanceBefore + Number(amount);

        const newTransaction = new Transaction({
            amt_in_out: "IN",
            amount,
            description: `EVENT_REGISTRATION_${name}`,
            method: payment_method,
            institute: event.institute._id,
            institute_name: event.institute.name,
            user: userid,
            balance_before_transaction: balanceBefore,
            balance_after_transaction: balanceAfter,
            identification: `EVENT_REGISTRATION_${newParticipant._id.toHexString()}`
        });
        await newTransaction.save();

        log(`ADDED_SUCCESSFULLY_${newParticipant._id.toHexString()}`);
        return res.status(200).json(newParticipant);
    } catch (err) {
        log(`ERROR_ADDING_EVENT_PARTICIPANT_${eventid || 'UNKNOWN'}_${name || 'UNKNOWN'}`);
        console.error("Error adding event participant:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getAllEvents,
    addNewEvent,
    addEventParticipants,
    editEvent,
    eventParticipants,
    updateStatusToFalse,
    deleteEvent
};