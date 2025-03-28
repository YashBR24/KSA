const express = require('express');
const {getAllImages, addNewImage,updateStatus, deleteImage} = require('../controllers/GalleryController');
const router = express.Router();

const { log } = require("../Logs/logs")
router.post('/images',getAllImages);
router.post('/add-new-image',addNewImage);
router.post('/status-image',updateStatus);
router.post('/delete-image',deleteImage);
module.exports = router;
