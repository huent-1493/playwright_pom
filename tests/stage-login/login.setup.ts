import { expect, test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Tạo thư mục auth nếu chưa có
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
    console.log('📁 Created auth directory');
  }

  // Truy cập trang login
  await page.goto('https://www.saucedemo.com/');
  console.log('✅ Navigated to login page');

  // Thực hiện đăng nhập
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Đợi trang inventory load (không phải dashboard)
  await page.waitForURL('**/inventory.html');
  console.log('✅ Inventory page loaded');

  // Verify đăng nhập thành công
  await expect(page.getByText('Swag Labs')).toBeVisible();
  await expect(page.getByText('Products')).toBeVisible();
  console.log('✅ Login verified');

  // Lưu trạng thái vào file auth.json
  await page.context().storageState({ path: authFile });
  console.log('💾 Auth state saved to:', authFile);

  // Verify file được tạo
  if (fs.existsSync(authFile)) {
    console.log('✅ Auth file created successfully!');
  }
});