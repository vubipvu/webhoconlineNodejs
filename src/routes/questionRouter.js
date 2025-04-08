// routes/questionRouter.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions/:courseId - Lấy câu hỏi theo khóa học
router.get('/:courseId', async (req, res) => {
  try {
    const questions = await Question.find({ courseId: req.params.courseId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy câu hỏi', error: err });
  }
});

// POST /api/questions - Thêm mới câu hỏi
router.post('/', async (req, res) => {
  try {
    const { courseId, question, options, correctIndex } = req.body;
    const newQuestion = new Question({ courseId, question, options, correctIndex });
    await newQuestion.save();
    res.status(201).json({ message: 'Đã thêm câu hỏi', question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm câu hỏi', error: err });
  }
});

// DELETE /api/questions/:id - Xóa câu hỏi
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa câu hỏi' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa câu hỏi', error: err });
  }
});

module.exports = router;