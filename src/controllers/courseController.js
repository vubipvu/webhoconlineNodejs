// src/controllers/courseController.js
const Course = require('../models/Course');
const path = require('path');
const fs = require('fs');

// Tạo khóa học mới
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  const teacherId = req.user.id;
  const image = req.files.image;

  try {
    // Đảm bảo thư mục public/images tồn tại
    const uploadPath = path.join(__dirname, '../../public/images', image.name);

    // Di chuyển ảnh từ tmp đến thư mục public/images
    image.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi upload ảnh' });
      }

      // Tạo khóa học
      const newCourse = new Course({
        title,
        description,
        image: `/images/${image.name}`, // Lưu đường dẫn tới ảnh
        teacher: teacherId,
      });

      await newCourse.save();

      res.status(201).json({ message: 'Khóa học đã được tạo thành công!' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
