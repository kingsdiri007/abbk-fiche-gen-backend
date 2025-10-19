
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: String,
  content: String,
  methods: String,
  theoryHours: String,
  practiceHours: String
});

const formationSchema = new mongoose.Schema({
  formationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  formationRef: {
    type: String,
    required: true
  },
  software: {
    type: String,
    required: true
  },
  prerequisites: String,
  objectives: String,
  competencies: String,
  schedule: [scheduleSchema],
  isCustom: {
    type: Boolean,
    default: false
  },
  originalId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Formation', formationSchema);
