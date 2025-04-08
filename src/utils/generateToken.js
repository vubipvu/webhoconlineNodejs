const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('❌ Thiếu JWT_SECRET trong biến môi trường');
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // hoặc '1d', tùy bạn
  );
};

module.exports = generateToken;
