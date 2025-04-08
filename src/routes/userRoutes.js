const express = require('express');
const router = express.Router();
const User = require('../models/User');

// [GET] Lấy tất cả user
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [POST] Thêm user mới
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body; // Thêm role

  try {
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// [PUT] Cập nhật user theo ID (Cách đúng để hash lại mật khẩu nếu có thay đổi)
router.put('/:id', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password; // Nếu có đổi mật khẩu mới
    if (role) user.role = role;

    await user.save(); // Gọi save() để middleware hash mật khẩu hoạt động
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// [DELETE] Xoá user theo ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
