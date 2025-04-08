const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Bảo vệ route dành cho giáo viên
router.get('/teacher', protect, authorize('teacher'), (req, res) => {
  res.json({ message: `Chào mừng giáo viên ${req.user.name}` });
});

module.exports = router;
