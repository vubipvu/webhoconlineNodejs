const { Builder, By, until } = require('selenium-webdriver');

(async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Mở trang login
    await driver.get('http://localhost:3000/login');

    // Nhập email
    await driver.findElement(By.name('email')).sendKeys('admin@gmail.com');

    // Nhập mật khẩu
    await driver.findElement(By.name('password')).sendKeys('123456');

    // Click nút đăng nhập
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Đợi điều hướng hoặc xác minh đăng nhập thành công (tuỳ theo giao diện bạn có)
    await driver.wait(until.urlContains('/dashboard'), 5000);

    console.log('✅ Đăng nhập thành công!');
  } catch (error) {
    console.error('❌ Kiểm thử thất bại:', error);
  } finally {
    await driver.quit();
  }
})();
