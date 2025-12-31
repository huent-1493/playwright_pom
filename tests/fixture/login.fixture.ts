import { test as base, Page } from "@playwright/test";

base.use({ storageState: "playwright/.auth/user.json" });

// Define interface cho fixture
interface OrangeFixtures {
  loggedInPage: Page;
  cartWithItem: Page;
}

// Tạo fixture "loggedInPage"
// Extend base test với custom fixture
export const test = base.extend<OrangeFixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto("https://www.saucedemo.com/inventory.html");

    await use(page);
  },
  cartWithItem: async ({ loggedInPage }, use) => {
    await loggedInPage
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();
    await use(loggedInPage);
  },
});
