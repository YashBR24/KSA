const DetailsTG = require('../models/DetailsAcademy');
const Status = require('../models/Status');
const CryptoJS = require('crypto-js');
const User = require('../models/user');
const mongoose = require('mongoose');
const Students = require('../models/Academy');
const Sport = require('../models/Sport');
const Transaction = require('../models/Transaction');
const Institute = require('../models/Institute');
const Batch = require('../models/Batch');
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

// Edit sport
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

// Edit institute
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

// Add a new batch
const addBatch = async (req, res) => {
    try {
        log(`ADDING_NEW_BATCH`);
        const { name, start_time, end_time, sport_id } = req.body;

        // Validate sport_id
        const sport = await Sport.findById(sport_id);
        if (!sport) {
            return res.status(404).json({ error: 'Sport not found' });
        }

        const batch = new Batch({ name, start_time, end_time, sport_id });
        await batch.save();
        res.status(201).json(batch);
    } catch (error) {
        log(`ERROR_ADDING_NEW_BATCH`);
        res.status(400).json({ error: error.message });
    }
};

// Get all batches (filtered by sport_id if provided)
const getAllBatches = async (req, res) => {
    try {
        log(`FETCHING_ALL_BATCHES`);
        const { userId, sport_id } = req.body;

        const result1 = await User.findById(userId);
        if (!result1) {
            return res.status(200).json("Not Found");
        }

        const query = {};
        if (sport_id) {
            if (!mongoose.Types.ObjectId.isValid(sport_id)) {
                return res.status(400).json({ error: 'Invalid sport ID' });
            }
            const sport = await Sport.findById(sport_id);
            if (!sport) {
                return res.status(404).json({ error: 'Sport not found' });
            }
            query.sport_id = sport_id;
        }

        const batches = await Batch.find(query).populate('sport_id', 'name');
        res.status(200).json(batches);
    } catch (error) {
        log(`ERROR_FETCHING_ALL_BATCHES`);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get active batches (filtered by sport_id if provided)
const getActiveBatches = async (req, res) => {
    try {
        log(`FETCHING_ACTIVE_BATCHES`);
        const { sport_id } = req.body;

        const query = { active: true };
        if (sport_id) {
            if (!mongoose.Types.ObjectId.isValid(sport_id)) {
                return res.status(400).json({ error: 'Invalid sport ID' });
            }
            const sport = await Sport.findById(sport_id);
            if (!sport) {
                return res.status(404).json({ error: 'Sport not found' });
            }
            query.sport_id = sport_id;
        }

        const batches = await Batch.find(query).populate('sport_id', 'name');
        res.status(200).json(batches);
    } catch (error) {
        log(`ERROR_FETCHING_ACTIVE_BATCHES`);
        res.status(500).json({ message: 'Server error' });
    }
};

// Edit batch
const editBatch = async (req, res) => {
    try {
        log(`EDITING_BATCH_${req.params.id}`);
        const { id } = req.params;
        const { name, start_time, end_time, sport_id } = req.body;

        if (sport_id) {
            const sport = await Sport.findById(sport_id);
            if (!sport) {
                return res.status(404).json({ error: 'Sport not found' });
            }
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            id,
            { name, start_time, end_time, sport_id },
            { new: true, runValidators: true }
        );

        if (!updatedBatch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        res.status(200).json(updatedBatch);
    } catch (error) {
        log(`ERROR_EDITING_BATCH_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

// Toggle batch status
const changeBatchStatus = async (req, res) => {
    try {
        log(`CHANGING_BATCH_STATUS_${req.params.id}`);
        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ error: 'Batch not found' });
        batch.active = !batch.active;
        await batch.save();
        res.json(batch);
    } catch (error) {
        log(`ERROR_CHANGING_BATCH_STATUS_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

// Delete batch
const deleteBatch = async (req, res) => {
    try {
        log(`DELETING_BATCH_${req.params.id}`);
        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        await Batch.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
        log(`ERROR_DELETING_BATCH_${req.params.id}`);
        res.status(400).json({ error: error.message });
    }
};

// New controller: Get batches by sport
const getBatchesBySport = async (req, res) => {
    try {
        log(`FETCHING_BATCHES_BY_SPORT_${req.params.sport_id}`);
        const { sport_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sport_id)) {
            return res.status(400).json({ error: 'Invalid sport ID' });
        }

        const sport = await Sport.findById(sport_id);
        if (!sport) {
            return res.status(404).json({ error: 'Sport not found' });
        }

        const batches = await Batch.find({ sport_id, active: true }).select('name start_time end_time');
        res.status(200).json(batches);
    } catch (error) {
        log(`ERROR_FETCHING_BATCHES_BY_SPORT_${req.params.sport_id}`);
        res.status(500).json({ message: 'Server error' });
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
    editSport,
    addInstitute,
    getAllInstitutes,
    getActiveInstitutes,
    changeInstituteStatus,
    editInstitute,
    deleteInstitute,
    addBatch,
    getAllBatches,
    getActiveBatches,
    editBatch,
    changeBatchStatus,
    deleteBatch,
    getBatchesBySport // New controller
};