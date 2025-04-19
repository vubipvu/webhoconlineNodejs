describe('Tạo câu hỏi mới cho khóa học', () => {
    it('Gửi câu hỏi thành công đến API POST /api/questions', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/questions',
        body: {
          courseId: '660ff51e9e123456789abcde', // Thay bằng ID thực tế
          question: 'Node.js là gì?',
          options: [
            'Trình duyệt',
            'Runtime phía client',
            'Runtime phía server',
            'Thư viện C++'
          ],
          correctIndex: 2
        }
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body).to.have.property('message', 'Đã thêm câu hỏi')
        expect(res.body.question.question).to.include('Node.js')
      })
    })
  })
  describe('Lấy danh sách câu hỏi', () => {
    it('GET /api/questions/:courseId - Trả về mảng câu hỏi', () => {
      const courseId = '660f01a85c9f32b37c05d9b1'; // ⚠️ sửa thành ID thật của bạn
  
      cy.request(`http://localhost:3000/api/questions/${courseId}`)
        .then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.be.an('array')
          if (res.body.length > 0) {
            expect(res.body[0]).to.have.property('question')
            expect(res.body[0]).to.have.property('options')
            expect(res.body[0]).to.have.property('correctIndex')
          }
        })
    })
  })
  describe('Xóa câu hỏi theo ID', () => {
    it('DELETE /api/questions/:id - Xóa thành công', () => {
      const newQuestion = {
        courseId: '660f01a85c9f32b37c05d9b1', // ⚠️ đổi ID thật
        question: 'Câu hỏi tạm để test xóa',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
      }
  
      // Tạo câu hỏi trước khi xóa
      cy.request('POST', 'http://localhost:3000/api/questions', newQuestion)
        .then((res) => {
          expect(res.status).to.eq(201)
          const questionId = res.body.question._id
  
          // Gửi DELETE
          cy.request('DELETE', `http://localhost:3000/api/questions/${questionId}`)
            .then((delRes) => {
              expect(delRes.status).to.eq(200)
              expect(delRes.body.message).to.equal('Đã xóa câu hỏi')
            })
        })
    })
  })
  