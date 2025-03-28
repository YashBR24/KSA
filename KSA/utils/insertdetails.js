const mongoose = require('mongoose');
const DetailsTG = require('../models/DetailsTurfGround'); // Update the path if needed

// MongoDB connection setup
const mongoURI = 'mongodb://localhost:27017/gsa'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Connection error:', err));

// Data to be inserted
const data = [
    { active: true, amount: 1300, category: 'TURF', from: '09:00', name: 'Morning Cricket Turf', sport: 'Cricket', time_hr: 1, time_min: 0, to: '18:59' },
    { active: true, amount: 1500, category: 'TURF', from: '19:00', name: 'Evening Cricket Turf', sport: 'Cricket', time_hr: 1, time_min: 0, to: '08:59' },
    { active: true, amount: 1300, category: 'TURF', from: '09:00', name: 'Morning Football Turf', sport: 'Football', time_hr: 1, time_min: 0, to: '19:00' },
    { active: true, amount: 1600, category: 'TURF', from: '19:00', name: 'Evening Football Turf', sport: 'Football', time_hr: 1, time_min: 0, to: '09:00' },
    { active: true, amount: 1400, category: 'GROUND', from: '09:00', name: 'Morning Ground Cricket', sport: 'Cricket', time_hr: 1, time_min: 0, to: '19:00' },
    { active: true, amount: 1700, category: 'GROUND', from: '19:00', name: 'Evening Ground Cricket', sport: 'Cricket', time_hr: 1, time_min: 0, to: '09:00' },
    { active: true, amount: 1500, category: 'GROUND', from: '09:00', name: 'Morning Ground Football', sport: 'Football', time_hr: 1, time_min: 0, to: '19:00' },
    { active: true, amount: 1800, category: 'GROUND', from: '19:00', name: 'Evening Ground Football', sport: 'Football', time_hr: 1, time_min: 0, to: '09:00' },
    { active: true, amount: 2000, category: 'TURF', from: '09:00', name: 'Extended Cricket Turf Morning', sport: 'Cricket', time_hr: 2, time_min: 30, to: '18:59' },
    { active: true, amount: 2500, category: 'TURF', from: '19:00', name: 'Extended Football Turf Evening', sport: 'Football', time_hr: 2, time_min: 30, to: '09:00' }
];

// Function to insert data directly into MongoDB
async function insertDataDirectly() {
    try {
        await DetailsTG.insertMany(data);
        console.log('Data successfully inserted');
    } catch (err) {
        console.error('Insert error:', err);
    } finally {
        mongoose.connection.close(); // Close connection after insert
    }
}

// Call the function to insert data
insertDataDirectly();
