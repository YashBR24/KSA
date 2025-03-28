const mongoose = require('mongoose');
const Ground = require('../models/Ground'); // Adjust the path to your schema file

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/gsa'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const userIds = [
    '672766658d8bb9c83fa5e507',
    '67711bcbabbbb1921fae33da'
];

const planIds = [
    '672c4f558335eb43ac1b6e1e',
    '672c4f558335eb43ac1b6e1f',
    '672c4f558335eb43ac1b6e20',
    '672c4f558335eb43ac1b6e21',
    '672c90762c9a1a77c9c96fdd',
    '676bbaae32479a27f7240097'
];

// Dummy data generator
const createDummyData = () => {
    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
    const randomPlanId = planIds[Math.floor(Math.random() * planIds.length)];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10) + 1);

    return {
        name: `User-${Math.floor(Math.random() * 1000)}`,
        mobile_no: Math.floor(Math.random() * 9000000000) + 1000000000,
        booked_by: ['Manager', 'Admin', 'User'][Math.floor(Math.random() * 3)],
        start_date: startDate,
        end_date: endDate,
        amount: Math.floor(Math.random() * 5000) + 1000,
        ground: ['GROUND A', 'GROUND B'][Math.floor(Math.random() * 2)],
        payment_method: ['Cash', 'Card', 'Online'][Math.floor(Math.random() * 3)],
        payment_status: ['Paid', 'Unpaid', 'Partial'][Math.floor(Math.random() * 3)],
        description: 'This is a dummy booking description.',
        advance: Math.floor(Math.random() * 2000),
        leftover: Math.floor(Math.random() * 2000),
        advpaymentmode: ['Cash', 'Card', 'Online'][Math.floor(Math.random() * 3)],
        user_id: randomUserId,
        plan_id: randomPlanId,
        started: Math.random() < 0.5,
        ended: Math.random() < 0.5,
    };
};

// Insert dummy data
const insertDummyData = async () => {
    try {
        const dummyData = Array.from({ length: 10 }, createDummyData);
        await Ground.insertMany(dummyData);
        console.log('Dummy data inserted successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error inserting dummy data:', err);
    }
};

insertDummyData();
