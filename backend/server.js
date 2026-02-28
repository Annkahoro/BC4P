require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const syncAdmin = require('./seedAdmin');

const app = express();

// Connect to Database
connectDB().then(() => {
    // Sync admin credentials on startup
    syncAdmin();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('BC4P Data Collection API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
