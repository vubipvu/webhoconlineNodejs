const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Course = require('../models/Course');

// Route tạo khóa học mới
router.post('/', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'Không tìm thấy file ảnh tải lên.' });
  }

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin (tiêu đề và mô tả).' });
  }

  const image = req.files.image;
  const uploadDir = path.join(__dirname, '../public/images/');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const uploadPath = path.join(uploadDir, image.name);

  image.mv(uploadPath, async (err) => {
    if (err) {
      console.error('Lỗi khi upload file:', err);
      return res.status(500).json({ message: 'Lỗi khi upload file', error: err });
    }

    try {
      const newCourse = new Course({ title, description, image: image.name });
      await newCourse.save();

      res.status(201).json({
        message: 'Khóa học được tạo thành công!',
        course: newCourse
      });

    } catch (err) {
      console.error('Lỗi khi lưu vào MongoDB:', err);
      res.status(500).json({ message: 'Lỗi khi lưu vào MongoDB', error: err });
    }
  });
});

// Lấy danh sách khóa học
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khóa học:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học', error: err });
  }
});

// Xóa khóa học
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    res.status(200).json({ message: 'Xóa khóa học thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa khóa học', error: err.message });
  }
});

// Cập nhật khóa học
router.put('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });

  try {
    const { title, description } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join(__dirname, '../public/images/', image.name);
      await image.mv(uploadPath);
      course.image = image.name;
    }

    await course.save();
    res.json({ message: 'Cập nhật thành công', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
  }
});

module.exports = router;
