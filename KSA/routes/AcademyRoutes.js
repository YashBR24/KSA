// const express = require('express');
// const {getActiveDetailsAcademy,UpdatePlan, getActivePlans,getAllPlans,getAllStudents, AddPlan, ChangePlanStatus} = require('../controllers/AcademyController');
//
// const router = express.Router();
// const mongoose = require("mongoose");
// const Transaction = require("../models/Transaction");
// const User =require("../models/user")
// const { log } = require("../Logs/logs")
// const Balance = require("../models/Balance");
// router.post('/active-plans', getActivePlans);
// router.post('/students', getAllStudents);
// router.post('/all-plans', getAllPlans);
// router.post('/add-plan', AddPlan);
// router.put('/update-plan/:id', UpdatePlan);
// router.patch('/update-plan-status/:id/toggle', ChangePlanStatus);
// router.get('/status', getActiveDetailsAcademy);
//
// const Academy = require('../models/Academy');
//
// // Add new trainee
// router.post('/trainee', async (req, res) => {
//     try {
//         log(`ADD_NEW_TRAINEE`);
//         const trainee = new Academy(req.body);
//         await trainee.save();
//         res.status(201).send(trainee);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });
//
// // Update trainee
// router.put('/trainee/:id', async (req, res) => {
//     //console.log("UPDATE")
//     try {
//         log(`UPDATING_TRAINEE_${req.params.id}`);
//         const trainee = await Academy.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200);
//         res.send(trainee);
//     } catch (error) {
//         log(`ERROR_UPDATING_TRAINEE`);
//         res.status(400).send(error.message);
//     }
// });
//
// // Toggle active status
// router.patch('/trainee/:id/toggle', async (req, res) => {
//     try {
//         log(`UPDATE_TRAINEE_STATUS_${req.params.id}`);
//         const trainee = await Academy.findById(req.params.id);
//         trainee.active = !trainee.active;
//         await trainee.save();
//         res.send(trainee);
//     } catch (error) {
//         log(`ERROR_UPDATING_TRAINEE_STATUS`);
//         //console.log(error)
//         res.status(400).send(error.message);
//     }
// });
//
// // Generate ID card (mock implementation)
// router.post('/trainee/:id/generate-id', async (req, res) => {
//     try {
//         log(`GENERATED_ID_CARD_FOR_TRAINEE_${req.params.id}`);
//         const trainee = await Academy.findById(req.params.id);
//         trainee.id_card_generated = true;
//         await trainee.save();
//         res.send({ message: 'ID card generated successfully.' });
//     } catch (error) {
//         log(`ERROR_GENERATING_ID_CARD`);
//         res.status(400).send(error.message);
//     }
// });
//
// // Get all trainees
// router.get('/trainees', async (req, res) => {
//     try {
//         log(`FETCH_ALL_TRAINEES`);
//         const trainees = await Academy.find({delete:false}).sort({roll_no:1});
//         res.send(trainees);
//     } catch (error) {
//         log(`ERROR_FETCHING_TRAINEES_ALL`);
//         res.status(400).send(error.message);
//     }
// });
//
// router.post('/id-card-given',async (req,res)=>{
//     try{
//         const {userid,id}=req.body;
//         log(`MARK_ID_CARD_GIVEN_${id}`);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(200).json("Not Found");
//         }
//         const trainee=await Academy.findById(id);
//         trainee.id_card_generated = true;
//         trainee.id_card_given = true;
//         trainee.save()
//         return res.status(200).send("Trainee Updated successfully.");
//     }
//     catch (error){
//         log(`ERROR_MARKING_ID_CARD_AS_GIVEN`);
//         //console.log(error)
//         res.status(500).send("Server Error");
//     }
// })
//
// router.post('/id-card-generated',async (req,res)=>{
//     try{
//         const {userid,id}=req.body;
//         log(`MARK_ID_CARD_GENERATED_${id}`);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(200).json("Not Found");
//         }
//         const trainee=await Academy.findById(id);
//         trainee.id_card_generated = true;
//         trainee.save()
//         return res.status(200).send("Trainee Updated successfully.");
//     }
//     catch (error){
//         log(`ERROR_MARKING_ID_CARD_GENERATED`);
//         //console.log(error)
//         res.status(500).send("Server Error");
//     }
// })
//
// const bal_id= "677ba181a9f86714ba5b860b"
// router.post('/renewal',async (req, res) => {
//     try{
//         const {trainee_id,name,roll_no,plan_id,amount,payment_method,start_date,expiry_date}=req.body;
//         log(`TRAINEE_RENEWAL_${trainee_id}`);
//
//         const result=await Academy.findById(trainee_id);
//         if (!result) {
//             return res.status(404).send("Trainee not found");
//         }
//         result.plan_id=new mongoose.Types.ObjectId(plan_id)
//         result.from=start_date;
//         result.to=expiry_date;
//         result.active=true;
//         result.save();
//         //console.log("Updated");
//         const balance1 = await Balance.findById(bal_id);
//         const bal = balance1.balance;
//         let balance_after_transaction;
//         const newTrans = new Transaction({
//                     amt_in_out: "IN",
//                     amount:Number(amount),
//                     description: "ACADEMY_RENEWAL_"+roll_no,
//                     balance_before_transaction:bal,
//                     method:payment_method,
//                     balance_after_transaction:Number(amount)+Number(bal),
//                     identification:"ACADEMY_RENEWAL_"+roll_no
//             })
//         balance1.balance=Number(amount)+Number(bal);
//         balance1.save();
//         newTrans.save();
//         //console.log("ALL DONE");
//         log(`RENEWED_TRAINEE_SUCCESSFULL_${trainee_id}`);
//         res.status(200).send({message:"SUCCESSFULLY_RENEWED"})
//     }
//     catch (error) {
//         log(`ERROR_IN_TRAINEE_RENEWAL`);
//         //console.log(error)
//         res.status(500).send("Server error");
//     }
//
// })
//
//
// module.exports = router;


const express = require('express');
const {
    getActiveDetailsAcademy,
    UpdatePlan,
    getActivePlans,
    getAllPlans,
    getAllStudents,
    AddPlan,
    ChangePlanStatus,
    addSport,
    getAllSports,
    getActiveSports,
    changeSportStatus,
    addInstitute,
    getAllInstitutes,
    getActiveInstitutes,
    changeInstituteStatus,
    editInstitute,
    editSport, deleteInstitute,
} = require('../controllers/AcademyController');
const router = express.Router();
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/user");
const { log } = require("../Logs/logs");
const Balance = require("../models/Balance");
const Academy = require('../models/Academy');

// Existing routes with controllers
router.post('/active-plans', getActivePlans);
router.post('/students', getAllStudents);
router.post('/all-plans', getAllPlans);
router.post('/add-plan', AddPlan);
router.put('/update-plan/:id', UpdatePlan);
router.patch('/update-plan-status/:id/toggle', ChangePlanStatus);
router.get('/status', getActiveDetailsAcademy);

router.post('/add-sport', addSport);
router.post('/all-sports', getAllSports);
router.post('/active-sports', getActiveSports);
router.put('/update-sport/:id', editSport);
router.patch('/update-sport-status/:id/toggle', changeSportStatus);

router.post('/add-institute', addInstitute);
router.post('/all-institutes', getAllInstitutes);
router.post('/active-institutes', getActiveInstitutes);
router.put('/update-institute/:id', editInstitute);
router.patch('/update-institute-status/:id/toggle', changeInstituteStatus);
router.post('/institute/:id', deleteInstitute);

// Add new trainee
router.post('/trainee', async (req, res) => {
    try {
        log(`ADD_NEW_TRAINEE`);
        const trainee = new Academy(req.body);
        await trainee.save();
        res.status(201).send(trainee);
    } catch (error) {
        log(`ERROR_ADDING_NEW_TRAINEE`);
        res.status(400).send(error.message);
    }
});

// Update trainee
router.put('/trainee/:id', async (req, res) => {
    try {
        log(`UPDATING_TRAINEE_${req.params.id}`);
        const trainee = await Academy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(trainee);
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_${req.params.id}`);
        res.status(400).send(error.message);
    }
});

// Toggle active status
router.patch('/trainee/:id/toggle', async (req, res) => {
    try {
        log(`UPDATE_TRAINEE_STATUS_${req.params.id}`);
        const trainee = await Academy.findById(req.params.id);
        trainee.active = !trainee.active;
        await trainee.save();
        res.send(trainee);
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_STATUS_${req.params.id}`);
        res.status(400).send(error.message);
    }
});

// Generate ID card
router.post('/trainee/:id/generate-id', async (req, res) => {
    try {
        log(`GENERATED_ID_CARD_FOR_TRAINEE_${req.params.id}`);
        const trainee = await Academy.findById(req.params.id);
        trainee.id_card_generated = true;
        await trainee.save();
        res.send({ message: 'ID card generated successfully.' });
    } catch (error) {
        log(`ERROR_GENERATING_ID_CARD_${req.params.id}`);
        res.status(400).send(error.message);
    }
});

// Get all trainees
router.get('/trainees', async (req, res) => {
    try {
        log(`FETCH_ALL_TRAINEES`);
        const trainees = await Academy.find({delete:false}).sort({roll_no:1});
        res.send(trainees);
    } catch (error) {
        log(`ERROR_FETCHING_TRAINEES_ALL`);
        res.status(400).send(error.message);
    }
});

router.post('/id-card-given', async (req, res) => {
    try {
        const {userid, id} = req.body;
        log(`MARK_ID_CARD_GIVEN_${id}`);
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const trainee = await Academy.findById(id);
        trainee.id_card_generated = true;
        trainee.id_card_given = true;
        await trainee.save();
        return res.status(200).send("Trainee Updated successfully.");
    } catch (error) {
        log(`ERROR_MARKING_ID_CARD_AS_GIVEN_${id}`);
        res.status(500).send("Server Error");
    }
});

router.post('/id-card-generated', async (req, res) => {
    try {
        const {userid, id} = req.body;
        log(`MARK_ID_CARD_GENERATED_${id}`);
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const trainee = await Academy.findById(id);
        trainee.id_card_generated = true;
        await trainee.save();
        return res.status(200).send("Trainee Updated successfully.");
    } catch (error) {
        log(`ERROR_MARKING_ID_CARD_GENERATED_${id}`);
        res.status(500).send("Server Error");
    }
});

const bal_id = "677ba181a9f86714ba5b860b";
router.post('/renewal', async (req, res) => {
    try {
        const {trainee_id, name, roll_no, plan_id, amount, payment_method, start_date, expiry_date} = req.body;
        log(`TRAINEE_RENEWAL_${trainee_id}`);

        const result = await Academy.findById(trainee_id);
        if (!result) {
            return res.status(404).send("Trainee not found");
        }
        result.plan_id = new mongoose.Types.ObjectId(plan_id);
        result.from = start_date;
        result.to = expiry_date;
        result.active = true;
        await result.save();

        const balance1 = await Balance.findById(bal_id);
        const bal = balance1.balance;
        const newTrans = new Transaction({
            amt_in_out: "IN",
            amount: Number(amount),
            description: "ACADEMY_RENEWAL_" + roll_no,
            balance_before_transaction: bal,
            method: payment_method,
            balance_after_transaction: Number(amount) + Number(bal),
            identification: "ACADEMY_RENEWAL_" + roll_no
        });
        balance1.balance = Number(amount) + Number(bal);
        await balance1.save();
        await newTrans.save();

        log(`RENEWED_TRAINEE_SUCCESSFULL_${trainee_id}`);
        res.status(200).send({message: "SUCCESSFULLY_RENEWED"});
    } catch (error) {
        log(`ERROR_IN_TRAINEE_RENEWAL_${trainee_id}`);
        res.status(500).send("Server error");
    }
});

module.exports = router;