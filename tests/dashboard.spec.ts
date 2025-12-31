import { expect } from '@playwright/test';
import { test } from './fixture/login.fixture.js';

// Test 1: Kiểm tra dashboard sau khi login
test('Checking dashboard correct display', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByText('Swag Labs')).toBeVisible();
});

test('verify sauce inventory products', async ({ loggedInPage }) => {
  // Verify we're on inventory page
  await expect(loggedInPage.getByText('Products')).toBeVisible();

  // Verify all 6 products are displayed
  const inventoryItems = loggedInPage.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  // Verify specific products exist
  await expect(loggedInPage.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(loggedInPage.getByText('Sauce Labs Bike Light')).toBeVisible();
  await expect(loggedInPage.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
  await expect(loggedInPage.getByText('Sauce Labs Onesie')).toBeVisible();
  await expect(loggedInPage.getByText('Test.allTheThings() T-Shirt (Red)')).toBeVisible();
});


test('verify adding item to cart', async ({ cartWithItem }) => {
  // Verify cart badge shows 1 item
  const cartBadge = cartWithItem.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');

  // Verify cart page shows the added item
  await cartWithItem.locator('.shopping_cart_link').click();
  await expect(cartWithItem.getByText('Sauce Labs Backpack')).toBeVisible();
});