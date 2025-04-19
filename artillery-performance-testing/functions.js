// functions.js

module.exports = {
    checkLoad: function (request, response) {
      if (response.statusCode === 500 || response.statusCode === 502 || response.statusCode === 503) {
        // Nếu hệ thống trả về lỗi 500, 502, hoặc 503, báo "Quá tải"
        console.log('Hệ thống quá tải');
        return { error: 'Quá tải', statusCode: response.statusCode };
      } else if (response.statusCode === 200 && response.timings.response > 500) {
        // Nếu thời gian phản hồi vượt quá 500ms, báo "Hệ thống phản hồi quá chậm"
        console.log('Hệ thống phản hồi quá chậm');
        return { error: 'Quá tải', statusCode: response.statusCode };
      } else {
        return { success: true };
      }
    }
  };
  