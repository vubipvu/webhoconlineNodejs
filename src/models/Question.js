const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  question: String,
  options: [String],
  correctIndex: Number
});

module.exports = mongoose.model('Question', questionSchema);
