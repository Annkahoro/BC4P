const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'Contributor' })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalSubmissions = await Submission.countDocuments();
    const pendingReview = await Submission.countDocuments({ status: 'Pending' });
    const approved = await Submission.countDocuments({ status: 'Approved' });
    
    // Stats by pillar
    const byPillar = await Submission.aggregate([
      { $group: { _id: '$pillar', count: { $sum: 1 } } }
    ]);

    res.json({
      totalSubmissions,
      pendingReview,
      approved,
      byPillar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { Parser } = require('json2csv');

// @desc    Export submissions as CSV (Admin only)
// @route   GET /api/admin/export
// @access  Private/Admin
router.get('/export', protect, admin, async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    const fields = [
      { label: 'Title', value: 'title' },
      { label: 'Pillar', value: 'pillar' },
      { label: 'Category', value: 'category' },
      { label: 'Contributor', value: 'user.name' },
      { label: 'Phone', value: 'user.phone' },
      { label: 'Status', value: 'status' },
      { label: 'Date', value: 'dateOfDocumentation' },
      { label: 'County', value: 'location.county' },
      { label: 'Sub-County', value: 'location.subCounty' }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(submissions);

    res.header('Content-Type', 'text/csv');
    res.attachment(' submissions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user and all their submissions (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Protection against deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Administrators cannot delete themselves' });
    }

    // 1. Delete all submissions by this user
    await Submission.deleteMany({ user: user._id });

    // 2. Delete the user
    await user.deleteOne();

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
