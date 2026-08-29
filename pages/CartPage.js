import { expect } from '@playwright/test';


export class CartPage {

  constructor(page) {

    this.page = page;

    this.cartRows = page.locator(
      '#cart_info_table tbody tr'
    );

    this.cartProductRows = this.cartRows.filter({
      has: page.locator(
        'a[href*="product_details"]'
      )
    });

    this.proceedToCheckoutButton = page.locator(
      'a:has-text("Proceed To Checkout")'
    );

  }


  // ==================================================
  // OPEN CART
  // ==================================================

  async goto() {

    await this.page.goto(
      '/view_cart',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );

    await expect(
      this.page.locator('#cart_info_table')
    ).toBeVisible({
      timeout: 20000
    });

  }


  // ==================================================
  // REMOVE PRODUCT
  // ==================================================

  async removeProductByIndex(index) {

    const productRow =
      this.cartProductRows.nth(index);

    await expect(
      productRow
    ).toBeVisible({
      timeout: 10000
    });

    await productRow
      .locator('.cart_quantity_delete')
      .click();

  }


  // ==================================================
  // PROCEED TO CHECKOUT
  // ==================================================

  async proceedToCheckout() {

    await this.proceedToCheckoutButton.waitFor({
      state: 'visible',
      timeout: 15000
    });

    await Promise.all([
      this.page.waitForURL(
        /.*(login|checkout).*/,
        {
          timeout: 15000
        }
      ).catch(() => {}),

      this.proceedToCheckoutButton.click()
    ]);

  }

}