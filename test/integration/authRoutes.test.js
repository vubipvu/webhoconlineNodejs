const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');

describe('Auth API', () => {

  it('Đăng ký thành công', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser' + Date.now() + '@example.com', // tránh trùng
        password: '123456',
        role: 'student'
      });

    expect(res.status).to.equal(201); // Hoặc 200 tùy bạn config
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.match(/đăng ký/i);
  });

  it('Đăng nhập thành công', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser1@example.com', // phải là user đã tồn tại
        password: '123456'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.token).to.be.a('string');
  });

  it('Sai mật khẩu thì trả về lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser1@example.com',
        password: 'sai_password'
      });

    expect(res.status).to.equal(400); // nếu bạn chưa sửa controller thì là 400
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.match(/sai/i);

  });
  it('Đăng ký thiếu email thì báo lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'No Email',
        password: '123456',
        role: 'student'
      });
  
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Vui lòng nhập đầy đủ thông tin.');
  });
  it('Đăng ký thiếu mật khẩu thì báo lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'No Pass',
        email: 'nopass' + Date.now() + '@test.com',
        role: 'student'
      });
  
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/mật khẩu/i);
  });
  it('Đăng ký với role không hợp lệ thì báo lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Wrong Role',
        email: 'wrongrole' + Date.now() + '@test.com',
        password: '123456',
        role: 'admin' // nếu hệ thống chỉ chấp nhận 'student' và 'teacher'
      });
  
    expect(res.status).to.equal(400);
  });
  it('Đăng nhập với email không hợp lệ thì báo lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'abc',
        password: '123456'
      });
  
    expect(res.status).to.equal(400);
  });
  it('Đăng nhập thiếu email thì báo lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: '123456'
      });
  
    expect(res.status).to.equal(400);
  });
  
  it('Đăng nhập thiếu mật khẩu thì báo lỗi', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser1@example.com'
      });
  
    expect(res.status).to.equal(400);
  });
  
  it('Không thể đăng ký với email đã tồn tại', async () => {
    const email = 'duplicated' + Date.now() + '@test.com';
  
    // Đăng ký lần đầu
    await request(app).post('/api/auth/register').send({
      name: 'User 1',
      email,
      password: '123456',
      role: 'student'
    });
  
    // Đăng ký lại
    const res = await request(app).post('/api/auth/register').send({
      name: 'User 2',
      email,
      password: '654321',
      role: 'teacher'
    });
  
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/đã tồn tại/i);
  });
  const jwt = require('jsonwebtoken');
it('Token trả về chứa đúng name và role', async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser1@example.com',
    password: '123456'
  });

  const decoded = jwt.decode(res.body.token);
  expect(decoded).to.have.property('name');
  expect(decoded).to.have.property('role');
});

  

});
