const express = require('express');
const {getAllStaff,addNewStaff,deleteStaff,editStaff} = require('../controllers/StaffController');
const router = express.Router();

const { log } = require("../Logs/logs")
router.post('/all-staff', getAllStaff);
router.post('/add-staff', addNewStaff);
router.post('/delete-staff', deleteStaff);
router.post('/edit-staff', editStaff);


module.exports = router;

