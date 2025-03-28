const mongoose = require('mongoose');
const Turf = require('../models/Turf'); // Update with the correct path to your model

mongoose.connect('mongodb://localhost:27017/gsa', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const addDummyData = async () => {
    try {
        const dummyData = [
            {
                name: 'Booking 1',
                booked_by: 'User',
                start_date: new Date('2024-11-10T10:00:00Z'), // Example future date
                end_date: new Date('2024-11-10T11:00:00Z'),
                amount: 1300,
                payment_method: 'Credit Card',
                payment_status: 'Paid',
                user_id: '672766658d8bb9c83fa5e507', // Replace with a valid ObjectId
                plan_id: '672b19d70c50e8bbca1e74dc', // Replace with a valid ObjectId
            },
            {
                name: 'Booking 2',
                booked_by: 'Admin',
                start_date: new Date('2024-11-15T14:00:00Z'),
                end_date: new Date('2024-11-15T16:30:00Z'),
                amount: 2000,
                payment_method: 'Cash',
                payment_status: 'Pending',
                user_id: '672767072e820b4f93a7ca47', // Replace with a valid ObjectId
                plan_id: '672b19d70c50e8bbca1e74ed', // Replace with a valid ObjectId
            },
            {
                name: 'Booking 3',
                booked_by: 'Manager',
                start_date: new Date('2024-11-20T22:00:00Z'),
                end_date: new Date('2024-11-20T23:00:00Z'),
                amount: 1500,
                payment_method: 'UPI',
                payment_status: 'Paid',
                user_id: '6729cef7505e1c907d72d9a4', // Replace with a valid ObjectId
                plan_id: '672b19d70c50e8bbca1e74df', // Replace with a valid ObjectId
            },
        ];

        await Turf.insertMany(dummyData);
        console.log('Dummy data added successfully');
    } catch (error) {
        console.error('Error adding dummy data:', error);
    } finally {
        mongoose.connection.close();
    }
};

addDummyData();
