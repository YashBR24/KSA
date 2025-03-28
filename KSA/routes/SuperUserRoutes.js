const express = require('express');
const { log } = require("../Logs/logs")
const User = require("../models/user")
const Logs = require("../models/Logs")
const router = express.Router();

router.post('/logs',async (req,res)=>{
    log("FETCHING_SUPERUSER_LOGS");
    const {userid}= req.body;
    const result1 = await User.findById(userid);
        if (!result1 || result1.role!=="Manager") {
            return res.status(404).json("User Not Found");
        }    
    const data=await Logs.find().sort({createdAt:-1});
    return res.status(200).json(data)
});

router.post('/users',async (req,res)=>{
    log("FETCHING_SUPERUSER_LOGS");
    const {userid}= req.body;
    const result1 = await User.findById(userid);
        if (!result1 || result1.role!=="Manager") {
            return res.status(404).json("User Not Found");
        }    
    const data=await User.find();
    return res.status(200).json(data)
});

module.exports = router;
