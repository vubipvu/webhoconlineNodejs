const { expect } = require('chai');
const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

const SERVER_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_test';

describe('🔌 Chat Socket.IO', function () {
  this.timeout(10000); // Tăng timeout toàn bộ

  let client1, client2;
  const token1 = jwt.sign({ name: 'User1', role: 'student' }, JWT_SECRET);
  const token2 = jwt.sign({ name: 'User2', role: 'teacher' }, JWT_SECRET);

  beforeEach((done) => {
    client1 = io(SERVER_URL, { forceNew: true });
    client2 = io(SERVER_URL, { forceNew: true });

    let connected = 0;

    const onReady = () => {
      if (++connected === 2) {
        done();
      }
    };

    client1.on('connect', () => {
      client1.emit('join', { token: token1 }, () => onReady());
    });

    client2.on('connect', () => {
      client2.emit('join', { token: token2 }, () => onReady());
    });
  });

  afterEach(() => {
    if (client1?.connected) client1.disconnect();
    if (client2?.connected) client2.disconnect();
  });

  it('Client1 gửi tin nhắn công khai và Client2 nhận được', (done) => {
    const msg = { user: 'User1 (student)', text: 'Hello from User1' };

    client2.on('chat message', (data) => {
      expect(data.text).to.equal(msg.text);
      done();
    });

    client1.emit('chat message', msg);
  });

  it('Client1 gửi tin nhắn riêng cho Client2', (done) => {
    client2.once('updateUsers', (users) => {
        const target = users.find(u => u.name === 'User2');
        if (!target) return done(new Error('Không tìm thấy User2'));
      
        const receiverId = target.id;
      
        client2.once('private message', (data) => {
          expect(data.from).to.equal('User1');
          expect(data.text).to.equal('Tin nhắn riêng');
          done();
        });
      
        client1.emit('private message', { toId: receiverId, text: 'Tin nhắn riêng' });
      });
      
  });

  it('Không gửi token khi join → server báo lỗi', (done) => {
    const badClient = io(SERVER_URL, { forceNew: true });

    badClient.on('connect', () => {
      badClient.emit('join', {}); // Không có token
    });

    badClient.on('error', (msg) => {
      expect(msg).to.include('Token');
      badClient.disconnect();
      done();
    });
  });

  it('Gửi tin nhắn riêng đến user không tồn tại → không lỗi', (done) => {
    client1.emit('private message', {
      toId: 'nonexistent-socket-id',
      text: 'Hello ghost user'
    });

    setTimeout(() => done(), 300); // chỉ cần không crash là pass
  });

  it('Client1 disconnect → Client2 thấy cập nhật user list', (done) => {
    client2.on('updateUsers', (users) => {
      const stillExists = users.find(u => u.name === 'User1');
      if (!stillExists) {
        done();
      }
    });
    client1.disconnect();
  });
});
