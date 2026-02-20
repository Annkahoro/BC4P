const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  caption: String,
  description: String,
  fileType: String, // image, video, audio, document
  originalName: String, // Added to store original filename
});

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  pillar: {
    type: String,
    required: true,
    enum: ['Cultural', 'Social', 'Economic', 'Environmental', 'Technical']
  },
  category: String, // e.g., Origin & Identity for Cultural
  description: String, // Rich text content (Section B)
  location: {
    county: String,
    subCounty: String,
    specificArea: String
  },
  tags: [String],
  dateOfDocumentation: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Revision Requested'],
    default: 'Approved'  // Auto-approved on submission
  },
  // Section D: Metadata
  metadata: {
    isPracticeActive: String, // Yes/No
    estimatedAgeOfPractice: String,
    sourceOfInformation: String, // Elder, Leader, etc.
    sensitivityLevel: {
      type: String,
      enum: ['Public', 'Restricted', 'Sacred'],
      default: 'Public'
    }
  },
  // Section E: Heritage Connection
  isLinkedToAncestralLand: Boolean,
  
  files: [fileSchema],
  
  adminNotes: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
