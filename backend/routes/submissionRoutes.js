const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private
router.post('/', protect, upload.array('files', 10), async (req, res) => {
  try {
    const {
      title,
      pillar,
      category,
      description,
      location,
      tags,
      metadata,
      isLinkedToAncestralLand
    } = req.body;

    const files = req.files ? req.files.map((file, index) => ({
      url: file.path,
      public_id: file.filename,
      fileType: file.mimetype.split('/')[0],
      originalName: file.originalname, // Save original name
      caption: req.body.captions ? (Array.isArray(req.body.captions) ? req.body.captions[index] : req.body.captions) : ''
    })) : [];

    const submission = await Submission.create({
      user: req.user._id,
      title,
      pillar,
      category,
      description,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
      metadata: typeof metadata === 'string' ? JSON.parse(metadata) : metadata,
      isLinkedToAncestralLand: isLinkedToAncestralLand === 'true',
      files: fileData
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Submission Error Details:', JSON.stringify(error, null, 2));
    console.error('Stack:', error.stack);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @desc    Update a submission
// @route   PUT /api/submissions/:id
// @access  Private (Owner)
router.put('/:id', protect, upload.array('files', 10), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check ownership
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // If approved, reset to Pending on edit
    if (submission.status === 'Approved') {
        submission.status = 'Pending'; 
    }

    const {
      title,
      category,
      description,
      location,
      tags,
      metadata,
      isLinkedToAncestralLand,
      existingFiles // IDs of files to keep (if receiving from frontend, but for now just append new ones)
    } = req.body;

    // Handle new files
    const newFiles = req.files ? req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      caption: '', // Will be updated below if captions exist
      fileType: file.mimetype.split('/')[0],
      originalName: file.originalname // Save original name
    })) : [];

    // For simplicity in this iteration, we append new files. 
    // Captions for new files need to be mapped correctly if passed.
    // Assuming captions logic is similar to create.
    if (req.files && req.body.captions) {
        newFiles.forEach((file, index) => {
            const caps = Array.isArray(req.body.captions) ? req.body.captions : [req.body.captions];
             // The captions array might line up with files array index
             // But if we have mix of old and new, it gets tricky.
             // For now, let's just use what we have, or empty.
             if (caps[index]) file.caption = caps[index];
        });
    }

    submission.title = title || submission.title;
    submission.category = category || submission.category;
    submission.description = description || submission.description;
    submission.location = location ? (typeof location === 'string' ? JSON.parse(location) : location) : submission.location;
    submission.tags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : submission.tags;
    submission.metadata = metadata ? (typeof metadata === 'string' ? JSON.parse(metadata) : metadata) : submission.metadata;
    submission.isLinkedToAncestralLand = isLinkedToAncestralLand ? (isLinkedToAncestralLand === 'true') : submission.isLinkedToAncestralLand;
    
    // Append new files
    submission.files = [...submission.files, ...newFiles];
    
    // Status resets to Pending on edit?
    // submission.status = 'Pending'; // Uncomment if edit should trigger re-review
    
    await submission.save();
    res.json(submission);

  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's own submissions
// @route   GET /api/submissions/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all submissions (Admin only)
// @route   GET /api/submissions
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { pillar, county, status, user } = req.query;
    let query = {};

    if (pillar) query.pillar = pillar;
    if (status) query.status = status;
    if (county) query['location.county'] = county;
    if (user) query.user = user;

    const submissions = await Submission.find(query)
      .populate('user', 'name phone location profilePicture clan')
      .sort({ createdAt: -1 });
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single submission by ID (Admin only)
// @route   GET /api/submissions/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'name phone location profilePicture clan');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update submission status (Admin only)
// @route   PUT /api/submissions/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (submission) {
      submission.status = status || submission.status;
      submission.adminNotes = adminNotes || submission.adminNotes;
      const updatedSubmission = await submission.save();
      res.json(updatedSubmission);
    } else {
      res.status(404).json({ message: 'Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Check ownership or admin status
    if (submission.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this submission' });
    }

    await submission.deleteOne();
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
