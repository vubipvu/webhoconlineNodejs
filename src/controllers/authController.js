const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Đảm bảo đã nhập jwt
const generateToken = require('../utils/generateToken'); // Nếu bạn sử dụng hàm này

// Đăng ký người dùng mới
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  // Kiểm tra tính hợp lệ của email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ.' });
  }

  // Kiểm tra role hợp lệ (student hoặc teacher)
  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
  }

  try {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Trả về phản hồi với dữ liệu người dùng (không trả mật khẩu)
    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký.' });
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!email || !password) {
    return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc.' });
  }

  try {
    // Kiểm tra nếu người dùng tồn tại trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại.' });
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Sai mật khẩu.' });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { _id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,  // Đảm bảo bạn có biến môi trường JWT_SECRET
      { expiresIn: '1d' }      // Token sẽ hết hạn sau 1 ngày
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi đăng nhập.' });
  }
};
