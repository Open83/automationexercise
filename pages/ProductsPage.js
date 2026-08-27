export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartLink = page.getByRole('banner').getByRole('link', { name: /cart/i });
    this.productWrapper = page.locator('.product-image-wrapper');
  }

  async goto() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded', timeout: 20000 });
  }

  async addProductToCartByIndex(index) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const product = this.productWrapper.nth(index);
      try {
        const addInCard = product.locator('.productinfo a.add-to-cart').first();
        if (await addInCard.count()) {
          await product.hover();
          await Promise.all([
            this.page.waitForResponse(response => response.url().includes('/add_to_cart'), { timeout: 10000 }),
            addInCard.click({ force: true }),
          ]);
        } else {
          const viewByHref = product.locator('a[href*="product_details"]').first();
          if (!(await viewByHref.count())) {
            throw new Error(`Product ${index} has no add-to-cart or product-details control`);
          }
          await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            viewByHref.click({ force: true }),
          ]);
        }

        const add = this.page.getByText('Add to cart', { exact: true }).first();
        if (this.page.url().includes('/product_details/') && await add.count()) {
          await Promise.all([
            this.page.waitForResponse(response => response.url().includes('/add_to_cart'), { timeout: 10000 }),
            add.click({ force: true }),
          ]);
        }

        await this.continueShoppingButton.waitFor({ state: 'visible', timeout: 10000 });
        return;
      } catch (err) {
        if (attempt === 1) {
          throw new Error(`Unable to add product ${index} to the cart: ${err.message}`);
        }
        await this.goto();
      }
    }
  }

  async closeAddedModalAndContinueShopping() {
    // Robustly close the add-to-cart modal:
    // 1) click the Continue Shopping button
    // 2) else click any .close-modal button
    // 3) else press Escape
    try {
      await this.continueShoppingButton.waitFor({ state: 'visible', timeout: 8000 });
      await this.continueShoppingButton.click({ force: true });
    } catch (e) {}

    try {
      const closeModal = this.page.locator('.close-modal, button[data-dismiss="modal"]');
      if (await closeModal.first().isVisible()) {
        await closeModal.first().click({ force: true });
      }
    } catch (e) {}

    try {
      await this.page.keyboard.press('Escape');
    } catch (e) {}

    if (this.page.url().includes('/product_details/')) {
      await this.goto();
    }
  }

  async goToCart() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded', timeout: 20000 });
  }
}
