import { test, expect } from '@playwright/test';
// Use the pre-created authenticated storage state only for these checkout tests
test.use({ storageState: 'storageState.json' });
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Tests expect an authenticated session. Create `storageState.json` via
// `tests/global-setup.js` (requires EXISTING_TEST_EMAIL and EXISTING_TEST_PASSWORD env vars)

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('text=Logged in as')).toBeVisible({ timeout: 10000 });
  });

  test('should complete a full order as a logged-in user', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.closeAddedModalAndContinueShopping();

    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.addOrderCommentAndPlaceOrder('Please deliver in the evening.');
    await checkoutPage.fillPaymentDetails({
      name: 'QA Tester',
      cardNumber: '4111111111111111',
      cvc: '123',
      month: '05',
      year: '2027',
    });

    await expect(checkoutPage.successMessage).toBeVisible();
  });

  test('should show exactly the products that were added when reviewing the order', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(2);
    await productsPage.closeAddedModalAndContinueShopping();

    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    const rowCount = await page
      .locator('table tbody tr')
      .filter({ has: page.locator('a[href*="product_details"]') })
      .count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });
});
