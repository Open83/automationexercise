import { test, expect } from '@playwright/test';

import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';


// ==================================================
// AUTHENTICATED SESSION
// ==================================================

test.use({
  storageState: 'storageState.json'
});


// ==================================================
// CHECKOUT TESTS
// ==================================================

test.describe('Checkout', () => {

  // ==================================================
  // BEFORE EACH TEST
  // ==================================================

  test.beforeEach(async ({ page }) => {

    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });

    await expect(
      page.getByText('Logged in as', {
        exact: false
      })
    ).toBeVisible({
      timeout: 10000
    });

  });


  // ==================================================
  // TEST 1
  // COMPLETE FULL ORDER
  // ==================================================

  test(
    'should complete a full order as a logged-in user',
    async ({ page }) => {

      const productsPage = new ProductsPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);


      // ------------------------------------------
      // OPEN PRODUCTS
      // ------------------------------------------

      await productsPage.goto();


      // ------------------------------------------
      // ADD PRODUCT
      // ------------------------------------------

      await productsPage.addProductToCartByIndex(0);


      // ------------------------------------------
      // CLOSE MODAL
      // ------------------------------------------

      await productsPage.closeAddedModalAndContinueShopping();


      // ------------------------------------------
      // OPEN CART
      // ------------------------------------------

      await productsPage.goToCart();


      // ------------------------------------------
      // PROCEED TO CHECKOUT
      // ------------------------------------------

      await cartPage.proceedToCheckout();


      // ------------------------------------------
      // PLACE ORDER
      // ------------------------------------------

      await checkoutPage.addOrderCommentAndPlaceOrder(
        'Please deliver in the evening.'
      );


      // ------------------------------------------
      // PAYMENT
      // ------------------------------------------

      await checkoutPage.fillPaymentDetails({
        name: 'QA Tester',
        cardNumber: '4111111111111111',
        cvc: '123',
        month: '05',
        year: '2027'
      });


      // ------------------------------------------
      // VERIFY ORDER
      // ------------------------------------------

      await expect(
        checkoutPage.successMessage
      ).toBeVisible({
        timeout: 30000
      });

    }
  );


  // ==================================================
  // TEST 2
  // VERIFY ORDER PRODUCTS
  // ==================================================

  test(
    'should show exactly the products that were added when reviewing the order',
    async ({ page }) => {

      const productsPage = new ProductsPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);


      // ------------------------------------------
      // OPEN PRODUCTS
      // ------------------------------------------

      await productsPage.goto();


      // ------------------------------------------
      // ADD PRODUCT
      // ------------------------------------------

      await productsPage.addProductToCartByIndex(2);


      // ------------------------------------------
      // CLOSE MODAL
      // ------------------------------------------

      await productsPage.closeAddedModalAndContinueShopping();


      // ------------------------------------------
      // OPEN CART
      // ------------------------------------------

      await productsPage.goToCart();


      // ------------------------------------------
      // VERIFY CART PRODUCT
      // ------------------------------------------

      const cartProductRows = page
        .locator('#cart_info_table tbody tr')
        .filter({
          has: page.locator(
            'a[href*="product_details"]'
          )
        });

      await expect(
        cartProductRows
      ).toHaveCount(1, {
        timeout: 15000
      });


      // ------------------------------------------
      // PROCEED TO CHECKOUT
      // ------------------------------------------

      await cartPage.proceedToCheckout();


      // ------------------------------------------
      // VERIFY CHECKOUT REVIEW SECTION
      // ------------------------------------------

      await expect(
        checkoutPage.reviewOrderHeading
      ).toBeVisible({
        timeout: 15000
      });


      // ------------------------------------------
      // VERIFY PRODUCT IN REVIEW ORDER
      // ------------------------------------------

      await expect(
        checkoutPage.reviewOrderProductRows
      ).toHaveCount(1, {
        timeout: 15000
      });

    }
  );

});