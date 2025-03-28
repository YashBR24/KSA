const express = require('express');
const {getActiveDetailsGround,getImages,getBookings,BookingTransactions,MarkAsPaid} = require('../controllers/GroundBookingController');
const { getUpcomingBookings, getActivePlans, newBooking, changeStatus, updateBooking} = require("../controllers/ManagerGroundController");

const { log } = require("../Logs/logs")
const router = express.Router();
router.get('/plans', getActivePlans);
router.get('/status', getActiveDetailsGround);
router.get('/images', getImages);
router.get('/upcoming-bookings', getUpcomingBookings);
router.get('/bookings', getBookings);
router.post('/book', newBooking);
router.patch('/bookings/:id/status',changeStatus);
router.put('/bookings/:id',updateBooking);
router.post('/booking/mark-as-paid',MarkAsPaid);
router.post('/booking/transactions',BookingTransactions);
module.exports = router;
