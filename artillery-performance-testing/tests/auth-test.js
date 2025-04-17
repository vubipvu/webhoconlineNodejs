const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');  // Đảm bảo đã nhập thư viện jsonwebtoken

describe('Auth API', () => {

  it('Đăng ký thành công với thông tin hợp lệ', async () => {
    const email = 'testuser' + Date.now() + '@example.com'; // Đảm bảo email là duy nhất
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: email,
        password: '123456',
        role: 'student'
      });

    // Kiểm tra xem mã trạng thái trả về là 201 (tạo người dùng thành công)
    expect(res.status).to.equal(201);
    // Kiểm tra xem có thông báo "đăng ký thành công"
    expect(res.body).to.have.property('message').that.match(/đăng ký/i);
    console.log(`User registered successfully with email: ${email}`);
  });

  it('Đăng nhập thành công với thông tin hợp lệ và nhận token', async () => {
    const email = 'testuser1@example.com';
    const password = '123456';
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: email,
        password: password
      });

    // Kiểm tra xem mã trạng thái trả về là 200 (đăng nhập thành công)
    expect(res.status).to.equal(200);
    // Kiểm tra xem có trả về token
    expect(res.body).to.have.property('token');
    
    const decoded = jwt.decode(res.body.token);  // Giải mã token JWT
    console.log(`Decoded JWT:`, decoded);
    
    // Kiểm tra xem token chứa thông tin người dùng
    expect(decoded).to.have.property('name');
    expect(decoded).to.have.property('role');
    console.log(`User logged in successfully. Name: ${decoded.name}, Role: ${decoded.role}`);
  });
});
