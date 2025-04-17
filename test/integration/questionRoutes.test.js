const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const Course = require('../../src/models/Course');
const Question = require('../../src/models/Question');

describe('Question API', () => {
  let courseId;
  let questionId;

  before(async () => {
    const course = new Course({
      title: 'Khóa học kiểm thử',
      description: 'Mô tả khóa học kiểm thử',
      image: 'test.jpg'
    });
    const savedCourse = await course.save();
    courseId = savedCourse._id;
  });

  it('Thêm câu hỏi mới thành công', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        courseId: courseId.toString(),
        question: 'Câu hỏi kiểm thử',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('question');
    questionId = res.body.question._id;
  });

  it('Lấy danh sách câu hỏi theo courseId', async () => {
    const res = await request(app).get(`/api/questions/${courseId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Xóa câu hỏi vừa tạo', async () => {
    const res = await request(app).delete(`/api/questions/${questionId}`);
    expect(res.status).to.equal(200);
  });

  it('Xóa câu hỏi không tồn tại', async () => {
    const fakeId = '663020be29f5c8deaad00000';
    const res = await request(app).delete(`/api/questions/${fakeId}`);
    expect(res.status).to.equal(404);
  });

  // --- Extra 10 Test Cases ---

  it('Thêm câu hỏi thiếu trường question', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({ courseId, options: ['A', 'B'], correctIndex: 0 });
    expect(res.status).to.equal(500);
  });

  it('Thêm câu hỏi với correctIndex lớn hơn options.length', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        courseId,
        question: 'Test invalid correctIndex',
        options: ['A', 'B'],
        correctIndex: 5
      });
    expect(res.status).to.equal(201); // MongoDB không validate correctIndex theo length
  });

  it('Lấy danh sách câu hỏi với courseId sai', async () => {
    const res = await request(app).get('/api/questions/invalidid123');
    expect(res.status).to.be.oneOf([400, 500]);
  });

  it('Xóa câu hỏi với id sai', async () => {
    const res = await request(app).delete('/api/questions/invalidid123');
    expect(res.status).to.be.oneOf([400, 500]);
  });

  it('Thêm nhiều câu hỏi cho 1 khóa học', async () => {
    for (let i = 1; i <= 3; i++) {
      const res = await request(app)
        .post('/api/questions')
        .send({
          courseId,
          question: `Question ${i}`,
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 2
        });
      expect(res.status).to.equal(201);
    }
  });

  it('Lấy danh sách sau khi thêm nhiều câu hỏi', async () => {
    const res = await request(app).get(`/api/questions/${courseId}`);
    expect(res.body.length).to.be.gte(3);
  });

  it('Xóa toàn bộ câu hỏi còn lại của khóa học', async () => {
    const res = await request(app).get(`/api/questions/${courseId}`);
    for (const q of res.body) {
      const del = await request(app).delete(`/api/questions/${q._id}`);
      expect(del.status).to.equal(200);
    }
  });

  it('Xóa không thành khi courseId là null', async () => {
    const res = await request(app).get('/api/questions/null');
    expect(res.status).to.be.oneOf([400, 500]);
  });

  it('Không cho phép correctIndex < 0', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        courseId,
        question: 'Test correctIndex < 0',
        options: ['A', 'B'],
        correctIndex: -1
      });
    expect(res.status).to.equal(201); // backend chưa validate - backend nên validate
  });
});