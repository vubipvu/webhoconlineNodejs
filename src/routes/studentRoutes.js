const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middlewares/authMiddleware');

// POST /api/student/enroll/:courseId
router.post('/enroll/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const courseId = req.params.courseId;

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi.' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});
// DELETE /api/student/unenroll/:courseId

router.delete('/unenroll/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const courseId = req.params.courseId;

    // Lọc bỏ khóa học đã đăng ký
    user.enrolledCourses = user.enrolledCourses.filter(
      (id) => id.toString() !== courseId
    );

    await user.save();
    res.status(200).json({ message: 'Đã hủy đăng ký khóa học.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi hủy đăng ký.', error: err.message });
  }
});
// GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json({ enrolledCourses: user.enrolledCourses || [] });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  });
  

module.exports = router;
