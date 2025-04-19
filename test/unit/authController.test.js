// test/unit/authController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');
const { login, register } = require('../../src/controllers/authController');

describe('Auth Controller - Hộp trắng', () => {
  afterEach(() => sinon.restore());

  describe('register()', () => {
    afterEach(() => {
      sinon.restore(); // cleanup stub sau mỗi test
    });
  
    it('trả lỗi khi thiếu dữ liệu đăng ký', async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await register(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
    });
  
    it('trả lỗi khi email đã tồn tại', async () => {
      sinon.stub(User, 'findOne').resolves({ email: 'existing@example.com' });
  
      const req = {
        body: {
          name: 'Test',
          email: 'existing@example.com',
          password: '123456',
          role: 'student',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await register(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
    });
  
    it('trả lỗi khi role không hợp lệ', async () => {
      sinon.stub(User, 'findOne').resolves(null); // không trùng email
  
      const req = {
        body: {
          name: 'Test',
          email: 'new@example.com',
          password: '123456',
          role: 'admin', // role sai
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await register(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Role không hợp lệ' })).to.be.true;
    });
  
    it('đăng ký thành công', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        _id: '1',
        name: 'Test',
        email: 'test@example.com',
        role: 'student',
      });
  
      const req = {
        body: {
          name: 'Test',
          email: 'test@example.com',
          password: '123456',
          role: 'student',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await register(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({
        message: sinon.match.string,
        user: sinon.match.object,
      })).to.be.true;
    });
  });
  

  describe('login()', () => {
    it('trả lỗi khi không tìm thấy user', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      const req = { body: { email: 'no@found.com', password: '123456' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await login(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
    });

    it('trả lỗi khi sai password', async () => {
      sinon.stub(User, 'findOne').resolves({
        email: 'test@example.com',
        password: await bcrypt.hash('correct', 10),
      });

      const req = { body: { email: 'test@example.com', password: 'wrong' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await login(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
    });

    it('đăng nhập thành công và trả token', async () => {
      sinon.stub(User, 'findOne').resolves({
        _id: '123456',
        name: 'Tester',
        role: 'student',
        email: 'test@example.com',
        password: await bcrypt.hash('123456', 10),
      });

      const tokenStub = sinon.stub(jwt, 'sign').returns('fake-token');

      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await login(req, res);

      expect(tokenStub.called).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ token: 'fake-token' })).to.be.true;
    });
  });
});