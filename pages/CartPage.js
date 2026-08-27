export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  async removeProductByIndex(index) {
    await this.cartRows.nth(index).locator('.cart_quantity_delete').click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await Promise.all([
      this.page.waitForURL(/.*(login|checkout).*/, { timeout: 10000 }).catch(() => {}),
      this.proceedToCheckoutButton.click({ force: true }),
    ]);
  }
}
