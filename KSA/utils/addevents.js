const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Status = require('../models/Status'); // Update with the path to your Events model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gsa', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sample event data
const eventsData = [
    {
        "name": "TURF",
        "description": "",
    },
    {
        "name": "GROUND",
        "description": "",
    },
    {
        "name": "ADMISSION",
        "description": "",
    }
];

// Function to read image file and convert to binary
const readImage = (imagePath) => {
    try {
        return fs.readFileSync(path.resolve(__dirname, imagePath));
    } catch (error) {
        console.error(`Error reading image at ${imagePath}:`, error);
        return null;
    }
};

// Function to add events
const addEvents = async () => {
    try {
        for (let eventData of eventsData) {

            const newEvent = new Status({
                name: eventData.name,
                description:eventData.description
            });

            await newEvent.save();
            console.log(`Event '${eventData.name}' added successfully`);
        }
    } catch (error) {
        console.error('Error adding events:', error);
    } finally {
        mongoose.connection.close(); // Close the connection once done
    }
};

// Run the addEvents function
addEvents();
