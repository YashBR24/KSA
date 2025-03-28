const express = require('express');
const {getDetails} = require('../controllers/HomeController');
const router = express.Router();

const { log } = require("../Logs/logs")
router.post('/home',getDetails);

module.exports = router;
