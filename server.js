require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const Connect_DB = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const questionRouter = require('./src/routes/questionRouter');

// App + server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect DB
Connect_DB();

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/questions', questionRouter);

// HTML routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/teacher', (req, res) => res.sendFile(path.join(__dirname, 'public', 'teacher', 'courses.html')));
app.get('/teacher/create-course.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'teacher', 'create-course.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, 'public', 'student', 'dashboard.html')));

// ================= SOCKET CHAT =================
const socketUsers = {}; // socket.id -> { name, role }

io.on('connection', (socket) => {
  console.log('🟢 Kết nối:', socket.id);

  socket.on('join', ({ token }) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { name, role } = payload;
      socketUsers[socket.id] = { name, role };

      io.emit('updateUsers', Object.entries(socketUsers).map(([id, u]) => ({ id, ...u })));
      console.log(`✅ ${name} (${role}) đã tham gia`);
    } catch (err) {
      console.log('❌ Token không hợp lệ:', err.message);
      socket.emit('error', 'Token không hợp lệ');
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // broadcast công khai
  });

  socket.on('private message', ({ toId, text }) => {
    const fromUser = socketUsers[socket.id];
    if (io.sockets.sockets.get(toId)) {
      io.to(toId).emit('private message', {
        from: fromUser.name,
        text,
        private: true
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Ngắt kết nối:', socket.id);
    delete socketUsers[socket.id];
    io.emit('updateUsers', Object.entries(socketUsers).map(([id, u]) => ({ id, ...u })));
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
