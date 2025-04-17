const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const path = require('path');

describe('Course API Performance Test', () => {
  let courseIdCreated = '';

  it('Tạo khóa học mới thành công', async () => {
    const res = await request(app)
      .post('/api/courses')
      .field('title', 'Khóa học kiểm thử')
      .field('description', 'Mô tả khóa học kiểm thử')
      .attach('image', path.resolve(__dirname, '../files/test.jpg'));  // Đảm bảo ảnh tồn tại

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('course');
    courseIdCreated = res.body.course._id;
  });
});
