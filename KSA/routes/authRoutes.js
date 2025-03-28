const express = require('express');
const { signup, verifyOtpLogin,verifyOtp, login,signups, verifyOtpLogins,verifyOtps, logins } = require('../controllers/authController');

const router = express.Router();

const { log } = require("../Logs/logs")
// FOR WEB-APPLICATIONS
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/verify-otp-login', verifyOtpLogin);
router.post('/login', login);

// FOR APPLICATIONS
router.post('/signups', signups);
router.post('/verify-otps', verifyOtps);
router.post('/verify-otp-logins', verifyOtpLogins);
router.post('/logins', logins);

module.exports = router;
