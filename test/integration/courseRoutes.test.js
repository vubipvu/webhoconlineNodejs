const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const path = require('path');

describe('Course API', () => {
  let courseIdCreated = ''; // để lưu ID khóa học vừa tạo

  it('Tạo khóa học mới thành công', async () => {
    const res = await request(app)
      .post('/api/courses')
      .field('title', 'Khóa học test')
      .field('description', 'Mô tả khóa học test')
      .attach('image', path.resolve(__dirname, '../files/test.jpg')); // dùng ảnh giả

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('course');
    expect(res.body.course.title).to.equal('Khóa học test');

    courseIdCreated = res.body.course._id;
  });

  it('Lấy danh sách khóa học', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Cập nhật khóa học vừa tạo', async () => {
    const res = await request(app)
      .put(`/api/courses/${courseIdCreated}`)
      .field('title', 'Khóa học đã cập nhật')
      .field('description', 'Mô tả đã cập nhật');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('course');
    expect(res.body.course.title).to.equal('Khóa học đã cập nhật');
  });

  it('Xóa khóa học vừa tạo', async () => {
    const res = await request(app).delete(`/api/courses/${courseIdCreated}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message');
  });

  it('Thử xóa khóa học không tồn tại', async () => {
    const fakeId = '663020be29f5c8deaad00000'; // ID MongoDB giả hợp lệ
    const res = await request(app).delete(`/api/courses/${fakeId}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message');
  });
  it('Không tạo được khóa học nếu thiếu tiêu đề', async () => {
    const res = await request(app)
      .post('/api/courses')
      .field('description', 'Không có tiêu đề')
      .attach('image', path.resolve(__dirname, '../files/test.jpg'));
  
      expect(res.status).to.equal(500);
      expect(res.body.message).to.match(/title/i); // Hoặc: /tiêu đề/i
      
  });
  it('Không tạo được khóa học nếu thiếu ảnh', async () => {
    const res = await request(app)
      .post('/api/courses')
      .field('title', 'Thiếu ảnh')
      .field('description', 'Không có ảnh');
  
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/không tìm thấy file ảnh/i);
  });
  it('Không thể cập nhật khóa học không tồn tại', async () => {
    const fakeId = '663020be29f5c8deaad00000';
    const res = await request(app)
      .put(`/api/courses/${fakeId}`)
      .field('title', 'Không tồn tại')
      .field('description', 'Không tồn tại');
  
    expect(res.status).to.equal(404);
    expect(res.body.message).to.match(/không tìm thấy/i);
  });
  it('Không chấp nhận file không phải ảnh', async () => {
    const res = await request(app)
      .post('/api/courses')
      .field('title', 'Ảnh sai định dạng')
      .field('description', 'Thử upload txt')
      .attach('image', path.resolve(__dirname, '../files/test.txt')); // file giả .txt
  
    expect(res.status).to.be.oneOf([400, 415]); // Tùy controller xử lý
  });
  it('Cập nhật khóa học với ảnh mới', async () => {
    // Tạo khóa học tạm để test update
    const createRes = await request(app)
      .post('/api/courses')
      .field('title', 'Update with image')
      .field('description', 'Before image')
      .attach('image', path.resolve(__dirname, '../files/test.jpg'));
  
    const id = createRes.body.course._id;
  
    const updateRes = await request(app)
      .put(`/api/courses/${id}`)
      .field('title', 'Update done')
      .field('description', 'With image')
      .attach('image', path.resolve(__dirname, '../files/test.jpg'));
  
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body.course.title).to.equal('Update done');
  
    await request(app).delete(`/api/courses/${id}`); // dọn dẹp
  });
  it('Lấy chi tiết 1 khóa học (nếu có route)', async () => {
    const resCreate = await request(app)
      .post('/api/courses')
      .field('title', 'Chi tiết course')
      .field('description', 'Mô tả chi tiết')
      .attach('image', path.resolve(__dirname, '../files/test.jpg'));
  
    const id = resCreate.body.course._id;
    const res = await request(app).get(`/api/courses/${id}`);
  
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('title');
  
    await request(app).delete(`/api/courses/${id}`);
  });
  
  
  
  
  
  
});
