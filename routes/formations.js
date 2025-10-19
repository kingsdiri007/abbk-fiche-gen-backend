
const express = require('express');
const router = express.Router();
const Formation = require('../models/Formation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// POST /formations - Add new formation (admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const formation = new Formation({
      ...req.body,
      createdBy: req.user.id
    });

    await formation.save();
    res.status(201).json(formation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /formations - Get all formations
router.get('/', async (req, res) => {
  try {
    const { software } = req.query;
    const filter = software && software !== 'all' ? { software } : {};
    
    const formations = await Formation.find(filter).sort({ createdAt: -1 });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /formations/:id - Get formation by ID
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /formations/:id - Update formation (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /formations/:id - Delete formation (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    res.json({ message: 'Formation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
