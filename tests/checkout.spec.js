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

    // Open home page
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


    // --------------------------------------------------
    // OPEN CART
    // --------------------------------------------------

    await page.goto('/view_cart', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });


    // --------------------------------------------------
    // CHECK WHETHER CART HAS PRODUCTS
    // --------------------------------------------------

    const cartTable = page.locator(
      '#cart_info_table'
    );

    const cartProductRows = page
      .locator('#cart_info_table tbody tr')
      .filter({
        has: page.locator(
          'a[href*="product_details"]'
        )
      });


    // --------------------------------------------------
    // CLEAR EXISTING CART
    // --------------------------------------------------

    if (await cartTable.count() > 0) {

      while (await cartProductRows.count() > 0) {

        const productRow =
          cartProductRows.first();

        const deleteButton =
          productRow.locator(
            '.cart_quantity_delete'
          );

        await deleteButton.click();

        await expect(
          productRow
        ).toHaveCount(0, {
          timeout: 10000
        }).catch(() => {});
      }

    }


    // --------------------------------------------------
    // RETURN TO HOME
    // --------------------------------------------------

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

      const productsPage =
        new ProductsPage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // Open products
      await productsPage.goto();


      // Add product
      await productsPage.addProductToCartByIndex(0);


      // Close added-to-cart modal
      await productsPage
        .closeAddedModalAndContinueShopping();


      // Open cart
      await productsPage.goToCart();


      // Verify exactly one product
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


      // Proceed to checkout
      await cartPage.proceedToCheckout();


      // Add comment and place order
      await checkoutPage
        .addOrderCommentAndPlaceOrder(
          'Please deliver in the evening.'
        );


      // Fill payment details
      await checkoutPage.fillPaymentDetails({
        name: 'QA Tester',
        cardNumber: '4111111111111111',
        cvc: '123',
        month: '05',
        year: '2027'
      });


      // Verify order
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

      const productsPage =
        new ProductsPage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // Open products
      await productsPage.goto();


      // Add product
      await productsPage.addProductToCartByIndex(2);


      // Close added-to-cart modal
      await productsPage
        .closeAddedModalAndContinueShopping();


      // Open cart
      await productsPage.goToCart();


      // Verify exactly one product in cart
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


      // Proceed to checkout
      await cartPage.proceedToCheckout();


      // Verify review section
      await expect(
        checkoutPage.reviewOrderHeading
      ).toBeVisible({
        timeout: 15000
      });


      // Verify exactly one product in review
      await expect(
        checkoutPage.reviewOrderProductRows
      ).toHaveCount(1, {
        timeout: 15000
      });

    }
  );

});