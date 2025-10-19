
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Pdf = require('../models/PDF');
const auth = require('../middleware/auth');

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// POST /pdf/upload - Upload PDF
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { ficheType, clientId, formData } = req.body;

    const pdf = new Pdf({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      ficheType,
      clientId,
      formData: formData ? JSON.parse(formData) : null,
      createdBy: req.user.id
    });

    await pdf.save();

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: {
        id: pdf._id,
        filename: pdf.filename,
        originalName: pdf.originalName,
        url: `/pdf/${pdf._id}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /pdf - Get all PDFs
router.get('/', auth, async (req, res) => {
  try {
    const { ficheType, clientId } = req.query;
    const filter = {};
    
    if (ficheType) filter.ficheType = ficheType;
    if (clientId) filter.clientId = clientId;

    const pdfs = await Pdf.find(filter)
      .populate('clientId', 'name clientId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /pdf/:id - Get PDF by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Check if file exists
    if (!fs.existsSync(pdf.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Send file
    res.sendFile(pdf.path);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /pdf/:id - Delete PDF
router.delete('/:id', auth, async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(pdf.path)) {
      fs.unlinkSync(pdf.path);
    }

    // Delete from database
    await Pdf.findByIdAndDelete(req.params.id);

    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;