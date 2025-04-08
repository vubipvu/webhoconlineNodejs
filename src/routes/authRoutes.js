// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Controller xử lý đăng ký và đăng nhập
const { register, login } = require('../controllers/authController');

// 📌 Route đăng ký người dùng (student hoặc teacher)
router.post('/register', register);

// 📌 Route đăng nhập người dùng
router.post('/login', login);

module.exports = router;
