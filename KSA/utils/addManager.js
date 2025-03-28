const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/user'); // Replace with the correct path to your User model

// Configure readline for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gsa2802', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Function to prompt user input
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Create user
const createUser = async (role) => {
  try {
    const name = await askQuestion(`Enter name for ${role}: `);
    const mobile_no = await askQuestion(`Enter mobile number for ${role}: `);
    const email = await askQuestion(`Enter email for ${role}: `);
    const date_of_birth = await askQuestion(`Enter date of birth (YYYY-MM-DD) for ${role}: `);
    const gender = await askQuestion(`Enter gender (male/female/other) for ${role}: `);
    const password = await askQuestion(`Enter password for ${role}: `);

    const user = new User({
      name,
      mobile_no,
      email,
      date_of_birth,
      gender,
      password,
        isVerified:true,
      role,
    });

    await user.save();
    console.log(`${role} user created successfully!`);
  } catch (error) {
    console.error(`Error creating ${role} user:`, error);
  }
};

// Main function
const main = async () => {
  await connectDB();

  await createUser('Manager');
  await createUser('Admin');

  rl.close();
  mongoose.disconnect();
};

main();
