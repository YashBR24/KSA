const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/OtherController');
// const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify user authentication

const { log } = require("../Logs/logs")
router.post('/get-queries', dashboardController.fetchQueries);
router.post('/resolve-query', dashboardController.ResolveQuery);
router.post('/delete-query',dashboardController.DeleteQuery);

// router.post('/book', authMiddleware, dashboardController.bookItem);

module.exports = router;
