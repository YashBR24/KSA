// const DetailsTG = require('../models/DetailsAcademy');
// const Status=require('../models/Status');
// const CryptoJS = require('crypto-js');
// const User=require('../models/user');
// const mongoose = require('mongoose');
// const Students = require('../models/Academy');
// const { log } = require("../Logs/logs")
//
// const getActiveDetailsAcademy = async (req, res) => {
//     try {
//         log(`GET_ACTIVE_ACADEMY_STATUS`);
//         const result = await Status.findOne({ name: 'ADMISSION' }); // Use findOne to get a single document
//         let status;
//
//         if (result && result.active) {  // Check if result exists and active is true
//             status = "ACTIVE";
//         } else {
//             status = "INACTIVE";
//         }
//
//         // //console.log("Backend Status:", status);  // Log status before encryption
//         const data = CryptoJS.AES.encrypt(status.toString(), "FetchAcademyActiveStatus").toString();
//         // //console.log("Encrypted Status:", data);  // Log encrypted status
//
//         res.status(200).json({ "acstatus": data });  // Ensure the response has acstatus
//     } catch (error) {
//         log(`ERROR_IN_FETCHING_ACTIVE_STATUS_ACADEMY`);
//         console.error('Error Fetching Status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
//
// const getActivePlans = async (req, res) => {
//     try {
//         log(`FETCHING_ACTIVE_PLANS_OF_ALL`);
//         const result = await DetailsTG.find({ active: true }); // Use findOne to get a single document
//
//         res.status(200).json(result);  // Ensure the response has acstatus
//     } catch (error) {
//         log(`ERROR_FETCHING_ACTIVE_PLANS`);
//         console.error('Error Fetching Status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
//
// const getAllPlans = async (req, res) => {
//     try {
//         const {userId} = req.body;
//         log(`GET_ALL_PLANS`);
//         const user_id =new mongoose.Types.ObjectId(userId);
//         const result1 = await User.findOne({ _id: user_id, role: {$in:['Manager','Admin'] }});
//         if (!result1){
//             return res.status(200).json("Not Found");
//         }
//         const result = await DetailsTG.find(); // Use findOne to get a single document
//
//         return res.status(200).json(result);  // Ensure the response has acstatus
//     } catch (error) {
//         log(`ERROR_FETCHING_ALL_PLANS`);
//         console.error('Error Fetching Status:', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// }
//
// const getAllStudents = async (req, res) => {
//     try {
//         log(`FETCHING_ALL_STUDENTS`);
//         const {userId} = req.body;
//         const user_id =new mongoose.Types.ObjectId(userId);
//         const result1 = await User.findOne({ _id: user_id, role: {$in:['Manager','Admin'] }});
//         if (!result1){
//             return res.status(200).json("Not Found");
//         }
//         const result = await Students.find(); // Use findOne to get a single document
//
//         return res.status(200).json(result);  // Ensure the response has acstatus
//     } catch (error) {
//         log(`ERROR_FETCHING_ALL_STUDENTS`);
//         console.error('Error Fetching Status:', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// };
//
// const AddPlan = async (req, res) => {
//     try {
//         log(`ADDING_NEW_PLAN`);
//         const plan = new DetailsTG(req.body);
//         await plan.save();
//         res.status(201).json(plan);
//     } catch (error) {
//         log(`ERROR_ADDING_NEW_PLAN`);
//         res.status(400).json({ error: error.message });
//     }
// };
//
// const UpdatePlan = async (req, res) => {
//     try {log(`UPDATING_PLAN_${req.params.id}`);
//         const updatedPlan = await DetailsTG.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedPlan) return res.status(404).json({ error: 'Plan not found' });
//         res.json(updatedPlan);
//     } catch (error) {
//         console.log(error)
//         log(`ERROR_UPDATING_PLAN`);
//         res.status(400).json({ error: error.message });
//     }
// };
//
// const ChangePlanStatus =async (req, res) => {
//     try {
//         log(`CHANGING_PLAN_STATUS_${req.params.id}`);
//         const plan = await DetailsTG.findById(req.params.id);
//         if (!plan) return res.status(404).json({ error: 'Plan not found' });
//         plan.active = !plan.active;
//         await plan.save();
//         res.json(plan);
//     } catch (error) {
//         log(`ERROR_CHANGING_PLAN_STATUS`);
//         res.status(400).json({ error: error.message });
//     }
// };
//
// module.exports = {ChangePlanStatus,UpdatePlan,AddPlan,getAllStudents,getAllPlans,getActivePlans,getActiveDetailsAcademy };


const DetailsTG = require('../models/DetailsAcademy');
const Status = require('../models/Status');
const CryptoJS = require('crypto-js');
const User = require('../models/user');
const mongoose = require('mongoose');
const Students = require('../models/Academy');
const Sport = require('../models/Sport');
const Transaction = require('../models/Transaction');
const Institute = require('../models/Institute');
const { log } = require("../Logs/logs");

const getActiveDetailsAcademy = async (req, res) => {
    try {
        log(`GET_ACTIVE_ACADEMY_STATUS`);
        const result = await Status.findOne({ name: 'ADMISSION' });
        let status;

        if (result && result.active) {
            status = "ACTIVE";
        } else {
            status = "INACTIVE";
        }

        const data = CryptoJS.AES.encrypt(status.toString(), "FetchAcademyActiveStatus").toString();
        res.status(200).json({ "acstatus": data });
    } catch (error) {
        log(`ERROR_IN_FETCHING_ACTIVE_STATUS_ACADEMY`);
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getActivePlans = async (req, res) => {
    try {
        log(`FETCHING_ACTIVE_PLANS_OF_ALL`);
        const result = await DetailsTG.find({ active: true });
        res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_ACTIVE_PLANS`);
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllPlans = async (req, res) => {
    try {
        log(`GET_ALL_PLANS`);
        const { userId } = req.body;
        const user_id = new mongoose.Types.ObjectId(userId);
        const result1 = await User.findOne({ _id: user_id, role: { $in: ['Manager', 'Admin'] } });
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const result = await DetailsTG.find();
        return res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_ALL_PLANS`);
        console.error('Error Fetching Status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllStudents = async (req, res) => {
    try {
        log(`FETCHING_ALL_STUDENTS`);
        const { userId } = req.body;
        const user_id = new mongoose.Types.ObjectId(userId);
        const result1 = await User.findOne({ _id: user_id, role: { $in: ['Manager', 'Admin'] } });
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const result = await Students.find();
        return res.status(200).json(result);
    } catch (error) {
        log(`ERROR_FETCHING_ALL_STUDENTS`);
        console.error('Error Fetching Status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const AddPlan = async (req, res) => {
    try {
        log(`ADDING_NEW_PLAN`);
        const plan = new DetailsTG(req.body);
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        log(`ERROR_ADDING_NEW_PLAN`);
        res.status(400).json({ error: error.message });
    }
};

const UpdatePlan = async (req, res) => {
    try {
        log(`UPDATING_PLAN_${req.params.id}`);
        const updatedPlan = await DetailsTG.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlan) return res.status(404).json({ error: 'Plan not found' });
        res.json(updatedPlan);
    } catch (error) {
        log(`ERROR_UPDATING_PLAN_${req.params.id}`);
        console.error('Error updating plan:', error);
        res.status(400).json({ error: error.message });
    }
};

const ChangePlanStatus = async (req, res) => {
    try {
        log(`CHANGING_PLAN_STATUS_${req.params.id}`);
        const plan = await DetailsTG.findById(req.params.id);
        if (!plan) return res.status(404).json({ error: 'Plan not found' });
        plan.active = !plan.active;
        await plan.save();
        res.json(plan);
    } catch (error) {
        log(`ERROR_CHANGING_PLAN_STATUS_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

// Add a new sport
const addSport = async (req, res) => {
    try {
        log(`ADDING_NEW_SPORT`);
        const { name } = req.body;
        const sport = new Sport({ name });
        await sport.save();
        res.status(201).json(sport);
    } catch (error) {
        log(`ERROR_ADDING_NEW_SPORT`);
        res.status(400).json({ error: error.message });
    }
};

// Get all sports
const getAllSports = async (req, res) => {
    try {
        log(`FETCHING_ALL_SPORTS`);
        const { userId } = req.body;
        const result1 = await User.findById(userId);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const sports = await Sport.find();
        res.status(200).json(sports);
    } catch (error) {
        log(`ERROR_FETCHING_ALL_SPORTS`);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get active sports
const getActiveSports = async (req, res) => {
    try {
        log(`FETCHING_ACTIVE_SPORTS`);
        const sports = await Sport.find({ active: true });
        res.status(200).json(sports);
    } catch (error) {
        log(`ERROR_FETCHING_ACTIVE_SPORTS`);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle sport status
const changeSportStatus = async (req, res) => {
    try {
        log(`CHANGING_SPORT_STATUS_${req.params.id}`);
        const sport = await Sport.findById(req.params.id);
        if (!sport) return res.status(404).json({ error: 'Sport not found' });
        sport.active = !sport.active;
        await sport.save();
        res.json(sport);
    } catch (error) {
        log(`ERROR_CHANGING_SPORT_STATUS_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

// Add a new institute
const addInstitute = async (req, res) => {
    try {
        log(`ADDING_NEW_INSTITUTE`);
        const { name } = req.body;
        const institute = new Institute({ name });
        await institute.save();
        res.status(201).json(institute);
    } catch (error) {
        log(`ERROR_ADDING_NEW_INSTITUTE`);
        res.status(400).json({ error: error.message });
    }
};

// Get all institutes
const getAllInstitutes = async (req, res) => {
    try {
        log(`FETCHING_ALL_INSTITUTES`);
        const { userId } = req.body;
        const result1 = await User.findById(userId);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const institutes = await Institute.find();
        res.status(200).json(institutes);
    } catch (error) {
        log(`ERROR_FETCHING_ALL_INSTITUTES`);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get active institutes
const getActiveInstitutes = async (req, res) => {
    try {
        log(`FETCHING_ACTIVE_INSTITUTES`);
        const institutes = await Institute.find({ active: true });
        res.status(200).json(institutes);
    } catch (error) {
        log(`ERROR_FETCHING_ACTIVE_INSTITUTES`);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle institute status
const changeInstituteStatus = async (req, res) => {
    try {
        log(`CHANGING_INSTITUTE_STATUS_${req.params.id}`);
        const institute = await Institute.findById(req.params.id);
        if (!institute) return res.status(404).json({ error: 'Institute not found' });
        institute.active = !institute.active;
        await institute.save();
        res.json(institute);
    } catch (error) {
        log(`ERROR_CHANGING_INSTITUTE_STATUS_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

const editInstitute = async (req, res) => {
    try {
        log(`EDITING_INSTITUTE_${req.params.id}`);
        const { id } = req.params;
        const { name } = req.body;

        const updatedInstitute = await Institute.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedInstitute) {
            return res.status(404).json({ error: 'Institute not found' });
        }

        res.status(200).json(updatedInstitute);
    } catch (error) {
        log(`ERROR_EDITING_INSTITUTE_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

// Delete institute
const deleteInstitute = async (req, res) => {
    try {
        log(`DELETING_INSTITUTE_${req.params.id}`);
        const institute = await Institute.findById(req.params.id);

        if (!institute) {
            return res.status(404).json({ error: 'Institute not found' });
        }

        await Institute.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Institute deleted successfully' });
    } catch (error) {
        log(`ERROR_DELETING_INSTITUTE_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

const editSport = async (req, res) => {
    try {
        log(`EDITING_SPORT_${req.params.id}`);
        const { id } = req.params;
        const { name } = req.body;

        const updatedSport = await Sport.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedSport) {
            return res.status(404).json({ error: 'Sport not found' });
        }

        res.status(200).json(updatedSport);
    } catch (error) {
        log(`ERROR_EDITING_SPORT_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    ChangePlanStatus,
    UpdatePlan,
    AddPlan,
    getAllStudents,
    getAllPlans,
    getActivePlans,
    getActiveDetailsAcademy,
    addSport,
    getAllSports,
    getActiveSports,
    changeSportStatus,
    addInstitute,
    getAllInstitutes,
    getActiveInstitutes,
    changeInstituteStatus,
    editInstitute,
    editSport,
    deleteInstitute
};