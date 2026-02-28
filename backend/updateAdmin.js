const User = require('./models/User');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Specify the correct path for .dotenv config
dotenv.config({ path: './backend/.env' });

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find admin by the role instead of email to ensure we update the existing super admin
    const admin = await User.findOne({ role: 'Super Admin' });
    
    if (!admin) {
      console.log('Super Admin not found. Please run seedAdmin.js first.');
      process.exit();
    }

    admin.email = process.env.ADMIN_EMAIL;
    admin.password = process.env.ADMIN_PASSWORD;
    
    await admin.save();
    console.log('Super Admin credentials updated successfully to match .env');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateAdmin();
