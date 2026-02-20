const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const pillar = (req.body && req.body.pillar) ? req.body.pillar.toLowerCase() : 'general';
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Pattern from working project: 
    // PDFs and Docs as 'raw' to avoid delivery/conversion issues
    let resourceType = 'auto';
    if (['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'].includes(ext)) {
      resourceType = 'raw';
    }

    // Clean filename for public_id
    const fileName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const publicId = `${Date.now()}-${fileName}`;

    return {
      folder: `bc4p/${pillar}`,
      resource_type: resourceType,
      public_id: publicId
    };
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
