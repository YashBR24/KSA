// server/loadLocalImages.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Image = require('../models/GroundImages');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(mongodb://localhost:27017/gsa2802, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch((error) => console.log('Error connecting to database:', error));

// Path to your local image folder
const imageFolderPath = 'C:\\Users\\SHIVAM\\Desktop\\Old Files\\Images';

// Function to load images
const loadImages = async () => {
    try {
        const files = fs.readdirSync(imageFolderPath);

        for (const file of files) {
            const filePath = path.join(imageFolderPath, file);
            const imgData = fs.readFileSync(filePath);
            const contentType = 'image/' + path.extname(file).slice(1);

            // Set title, description, and uploadedBy based on file or other criteria
            const title = path.basename(file, path.extname(file));  // Set filename (without extension) as title
            const description = `Image of ${title}`;  // Sample description; customize as needed
            const uploadedBy = Math.random() > 0.5 ? 'admin' : 'coach';  // Randomly assign 'admin' or 'coach'

            const image = new Image({
                title,
                description,
                data: imgData,
                contentType: contentType,
                uploadedBy,
                active: true  // Default to active
            });

            await image.save();
            console.log(`Image ${file} saved to database`);
        }
        console.log('All images loaded successfully');
    } catch (error) {
        console.error('Error loading images:', error);
    } finally {
        mongoose.connection.close();
    }
};

loadImages();
