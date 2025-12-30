/**
 * Use POM + hooks

Create 2 group test:
Group A – Checking products page:
beforeEach: Login →  /inventory.
Test: Checking num product on page.

Group B – Checking cart:
beforeEach: Login → add 1 product to cart.
Test: Checking cart displays the added product.
Requirements:
Use test.describe() to group 2 separate test suites.
Each group uses its own beforeEach, not affecting the other.
There are at least 2 tests in each group.
 */
const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");

test.describe("Checking product on page", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    /// Init LoginPage and go to Page
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
  });

  test("Confirm showing 6 products on page", async ({ page }) => {
    const products = page.locator('[data-test="inventory-item"]');

    await expect(products).toHaveCount(6);
  });

  test("Confirm basic information of the first product", async ({ page }) => {
    const firstProduct = page.locator('[data-test="inventory-item"]').first();

    // Checking showing name, price and add to cart button
    await expect(
      firstProduct.locator('[data-test="inventory-item-name"]')
    ).toBeVisible();
    await expect(
      firstProduct.locator('[data-test="inventory-item-price"]')
    ).toContainText("$");
    await expect(firstProduct.locator("button")).toContainText("Add to cart");
  });
});

test.describe("Checking add item to cart", () => {
  let loginPage;
  let firstProduct;

  test.beforeEach(async ({ page }) => {
    /// Init LoginPage and go to Page
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
    // Add first product to cart
    firstProduct = page.locator('[data-test="inventory-item"]').first();
    await firstProduct.locator("button").click();
    // Go to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart/);
  });

  test("Confirm product exists in cart", async ({ page }) => {
    const productsCart = page.locator('[data-test="inventory-item"]');
    const firstProductName = await firstProduct
      .locator('[data-test="inventory-item-name"]')
      .innerText();
    const firstProductCart = productsCart.filter({ hasText: firstProductName });
    await expect(productsCart).toHaveCount(1);

    /// Compare name product on page with name of first product added to cart
    await expect(firstProductName).toEqual(
      await firstProductCart
        .locator('[data-test="inventory-item-name"]')
        .innerText()
    );
  });
});
