const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/checkRole');

router.get('/verify', protect, authorize('teacher'), (req, res) => {
  res.json({ message: 'Đã xác thực giáo viên' });
});

module.exports = router;
