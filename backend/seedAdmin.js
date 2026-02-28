const User = require('./models/User');

const syncAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('Skipping admin sync: ADMIN_EMAIL/PASSWORD not set');
      return;
    }

    // Attempt to find by role first to be most flexible
    let admin = await User.findOne({ role: 'Super Admin' });

    if (!admin) {
      // Try finding by the provided email as fallback
      admin = await User.findOne({ email: adminEmail });
    }

    if (!admin) {
      // Create if it doesn't exist
      admin = new User({
        name: 'Super Admin',
        phone: '0000000000',
        email: adminEmail,
        password: adminPassword,
        role: 'Super Admin'
      });
      await admin.save();
      console.log('Super Admin created successfully from environment variables');
    } else {
      // Update if it exists to ensure sync with current env vars
      // Only save if things actually changed (save() triggers the bcrypt hook)
      if (admin.email !== adminEmail || admin.password !== adminPassword) {
          admin.email = adminEmail;
          admin.password = adminPassword;
          await admin.save();
          console.log('Super Admin credentials synchronized with environment variables');
      }
    }
  } catch (error) {
    console.error(`Admin Sync Error: ${error.message}`);
  }
};

module.exports = syncAdmin;
