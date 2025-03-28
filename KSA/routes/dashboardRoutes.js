const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { log } = require("../Logs/logs")
// const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify user authentication

router.get('/images', dashboardController.getImages);
router.get('/allimages', dashboardController.getAllImages);
router.post('/newquery',dashboardController.newQueries);
router.get('/getevents',dashboardController.getEvents);
router.post('/eventregistration',dashboardController.newEventRegistration);

// router.post('/book', authMiddleware, dashboardController.bookItem);

module.exports = router;
