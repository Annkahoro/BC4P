require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Submission = require('./models/Submission');

const cleanupTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- Database Cleanup Started ---');

    // Remove users created during verification (phone starts with 0712345)
    const userResult = await User.deleteMany({ phone: '0712345678' });
    console.log(`✅ Removed ${userResult.deletedCount} test users.`);

    // Remove submissions created during verification
    const subResult = await Submission.deleteMany({ title: 'Traditional Medicine Ritual' });
    console.log(`✅ Removed ${subResult.deletedCount} test submissions.`);

    console.log('--- Database Cleanup Complete ---');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

cleanupTestData();
