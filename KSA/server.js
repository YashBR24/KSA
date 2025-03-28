const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS library
require('dotenv').config();
const {updateTrainees1}=require("./controllers/ManagerGroundController")

const app = express();

// CORS configuration: allow everything
app.use(cors({
    origin: '*', // Allow all origins
    methods: '*', // Allow all HTTP methods
    allowedHeaders: '*', // Allow all headers
    credentials: true, // Allow cookies if needed for authentication
}));
app.options('*', cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/gsa")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/turf', require('./routes/TurfDetailsRoutes'));
app.use('/api/ground', require('./routes/GroundRoutes'));
app.use('/api/academy', require('./routes/AcademyRoutes'));
app.use('/api/manager', require('./routes/ManagerGroundRoutes'));

app.use('/api/accounts', require('./routes/AccountRoutes'));
app.use('/api/staff', require('./routes/StaffRoutes'));
app.use('/api/other', require('./routes/OtherRoutes'));
app.use('/api/event', require('./routes/EventRoutes'));
app.use('/api/gallery', require('./routes/GalleryRoutes'));
app.use('/api/turf-admin', require('./routes/BoxCricketRoutes'));
app.use('/api/admin/home', require('./routes/HomeRoutes'));
app.use('/api/inventory', require('./routes/InventoryRoutes'));
app.use('/api/superuser', require('./routes/SuperUserRoutes'));
// setInterval(updateTrainees1,60000)
app.use('/uploads', express.static('uploads'));

// Start server
const PORT = 5000 || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
