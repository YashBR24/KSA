const express = require('express');
const {getAllEvents, addNewEvent, editEvent,addEventParticipants, updateStatusToFalse, deleteEvent, eventParticipants} = require('../controllers/EventController');
const router = express.Router();
const { log } = require("../Logs/logs")

router.post('/events',getAllEvents);
router.post('/add-new-event',addNewEvent);
router.post('/edit-event',editEvent);
router.post('/status-event',updateStatusToFalse);
router.post('/delete-event',deleteEvent);
router.post("/event-participants",eventParticipants);
router.post("/add-event-participants",addEventParticipants);
module.exports = router;
