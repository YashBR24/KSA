const mongoose = require('mongoose');
const Academy = require('../models/Academy'); // Update with the correct path to your model file

const dummyData = [
    {
        name: "John Doe",
        amount: 15000,
        session: "2024-2025",
        plan_time: "1 year",
        father: "Michael Doe",
        occupation: "Engineer",
        address: "123 Main Street, City, Country",
        phone: "1234567890",
        dob: new Date("2005-08-15"),
        name_of_school: "Springfield High",
        current_class: "10th",
        photo: Buffer.from("DummyPhoto1"),
        signature: Buffer.from("DummySignature1"),
        date_and_place: "2024-01-01, Springfield",
        father_signature: Buffer.from("DummyFatherSignature1"),
        to: new Date("2025-01-01"),
        payment_number: 1,
        plan_id: "6772e44430a1a49c3dca40b6",
        user_id: "672766658d8bb9c83fa5e507",
    },
    {
        name: "Jane Smith",
        amount: 20000,
        session: "2024-2025",
        plan_time: "2 years",
        father: "Robert Smith",
        occupation: "Teacher",
        address: "456 Elm Street, Town, Country",
        phone: "0987654321",
        dob: new Date("2006-05-20"),
        name_of_school: "Riverside Academy",
        current_class: "9th",
        photo: Buffer.from("DummyPhoto2"),
        signature: Buffer.from("DummySignature2"),
        date_and_place: "2024-01-01, Riverside",
        father_signature: Buffer.from("DummyFatherSignature2"),
        to: new Date("2026-01-01"),
        payment_number: 2,
        plan_id: "6772e69b2aaf5a2d9758074e",
        user_id: "67711bcbabbbb1921fae33da",
    },
    {
        name: "Alice Johnson",
        amount: 18000,
        session: "2024-2025",
        plan_time: "1.5 years",
        father: "Mark Johnson",
        occupation: "Doctor",
        address: "789 Oak Avenue, Metropolis, Country",
        phone: "1122334455",
        dob: new Date("2007-03-10"),
        name_of_school: "Greenwood School",
        current_class: "8th",
        photo: Buffer.from("DummyPhoto3"),
        signature: Buffer.from("DummySignature3"),
        date_and_place: "2024-01-01, Metropolis",
        father_signature: Buffer.from("DummyFatherSignature3"),
        to: new Date("2025-07-01"),
        payment_number: 3,
        plan_id: "6772e6b92aaf5a2d97580752",
        user_id: "672766658d8bb9c83fa5e507",
    }
];

const insertDummyData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/gsa', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB.');

        // Insert dummy data
        const result = await Academy.insertMany(dummyData);
        console.log('Dummy data inserted:', result);

        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Error inserting dummy data:', error);
    }
};

insertDummyData();
