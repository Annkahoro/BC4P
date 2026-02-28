const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    county: String,
    subCounty: String,
    specificArea: String
  },
  profilePicture: {
    type: String,
    default: ''
  },
  clan: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['Contributor', 'Admin', 'Super Admin'],
    default: 'Contributor'
  },
  // Admin specific fields
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null/empty for non-admins
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // Required only for admins
  },
  passwordChangedAt: Date
}, {
  timestamps: true
});

// Hash password before saving if it exists
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Set passwordChangedAt to now (1 second in the past to ensure JWT iat is after this)
  this.passwordChangedAt = Date.now() - 1000;
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
