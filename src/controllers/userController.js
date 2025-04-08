const User = require('../models/User'); // đường dẫn đúng tới User.js

const createUser = async (req, res) => {
  try {
    const user = new User(req.body); // 💥 Phải là new User(...)
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
