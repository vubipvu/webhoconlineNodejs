const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  enrolledCourses: [  // ✅ Thêm trường này để lưu các khóa học học sinh đã đăng ký
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
}, {
  timestamps: true // ✅ Thêm thời gian tạo và cập nhật (optional nhưng hữu ích)
});

module.exports = mongoose.model('User', userSchema);
