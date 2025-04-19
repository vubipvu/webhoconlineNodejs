// const request = require('supertest');
// const app = require('../../server');
// const { expect } = require('chai');

// describe('Question API Performance Test', () => {
//   it('Thêm câu hỏi mới thành công', async () => {
//     const res = await request(app)
//       .post('/api/questions')
//       .send({
//         courseId: 'courseId',  // Cung cấp một khóa học hợp lệ
//         question: 'Câu hỏi kiểm thử',
//         options: ['A', 'B', 'C', 'D'],
//         correctIndex: 1
//       });

//     expect(res.status).to.equal(201);
//     expect(res.body).to.have.property('question');
//   });
// });
