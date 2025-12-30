/**
 * "Mixed hooks" test suite
 * Create 1 group test with the following flow
1. beforeAll: Print log ""Starting group test"".
2. beforeEach: Login.
3. Test: Checking functional .
4. afterEach: Take screenshot (if fail).
5. afterAll: Print log ""Ending group test"".
Requirements:
• Observe logs to see the order of hook execution.
Intentionally fail 1 Testcase to see how afterEach works.
 */

const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");

test.describe("Login tests using POM + hooks", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    /// Init LoginPage and go to Page
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Logout
    await page.getByRole("button", { name: "Open Menu" }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    // Screenshot when test fails
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test("Go to page products has inventory", async ({ page }) => {
    await expect(page).toHaveURL(/inventory/);
  });

  test("Checking title page has products and checking name first product", async ({
    page,
  }) => {
    await expect(page.locator(".title")).toHaveText("Products");
    const firstProductName = await page
      .locator(".inventory_item_name")
      .first()
      .textContent();
      //// Failed test case
    expect(firstProductName).toBe("Sauce Labs Backpacks");
  });
});

test.beforeAll(() => {
  console.log("Starting group test");
});

test.afterAll(() => {
  console.log("Ending group test");
});
