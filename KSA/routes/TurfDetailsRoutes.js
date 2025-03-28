const express = require('express');
const {getDefaultOneHourPrice,getUpcomingBookings,getActiveDetailsTurf ,getImages,getDetailsPrice} = require('../controllers/TurfBookingController');

const { log } = require("../Logs/logs")
const router = express.Router();

router.get('/details', getDefaultOneHourPrice);
router.get('/status', getActiveDetailsTurf);
router.get('/images', getImages);
router.get('/plans', getDetailsPrice);
router.get('/upcoming-bookings', getUpcomingBookings);


module.exports = router;
