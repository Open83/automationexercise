export class ProductsPage {
  constructor(page) {
    this.page = page;

    // ==================================================
    // PRODUCTS PAGE
    // ==================================================

    this.productWrapper = page.locator('.product-image-wrapper');

    this.addToCartButtons = page.locator(
      '.product-image-wrapper a.add-to-cart'
    );


    // ==================================================
    // ADD TO CART MODAL
    // ==================================================

    this.addedMessage = page.getByText(
      'Added!',
      { exact: true }
    );

    this.continueShoppingButton = page.getByRole(
      'button',
      {
        name: 'Continue Shopping'
      }
    );

    this.closeModalButton = page.locator(
      '.close-modal, button[data-dismiss="modal"]'
    );


    // ==================================================
    // CART
    // ==================================================

    this.viewCartLink = page.getByRole(
      'link',
      {
        name: /cart/i
      }
    );
  }


  // ==================================================
  // OPEN PRODUCTS PAGE
  // ==================================================

  async goto() {

    await this.page.goto(
      '/products',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );

    await this.productWrapper
      .first()
      .waitFor({
        state: 'visible',
        timeout: 30000
      });
  }


  // ==================================================
  // ADD PRODUCT TO CART BY INDEX
  // ==================================================

  async addProductToCartByIndex(index) {

    const product =
      this.productWrapper.nth(index);


    // ------------------------------------------
    // Verify product exists
    // ------------------------------------------

    await product.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Find Add to Cart button
    // ------------------------------------------

    const addToCartButton =
      product.locator(
        'a.add-to-cart'
      ).first();


    await addToCartButton.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Scroll product into view
    // ------------------------------------------

    await addToCartButton.scrollIntoViewIfNeeded();


    // ------------------------------------------
    // Click Add to Cart
    // ------------------------------------------

    await addToCartButton.click();


    // ------------------------------------------
    // Verify Add to Cart confirmation
    // ------------------------------------------

    await this.addedMessage.waitFor({
      state: 'visible',
      timeout: 20000
    });
  }


  // ==================================================
  // CLOSE ADD TO CART MODAL
  // ==================================================

  async closeAddedModalAndContinueShopping() {

    // ------------------------------------------
    // Try Continue Shopping
    // ------------------------------------------

    try {

      await this.continueShoppingButton.waitFor({
        state: 'visible',
        timeout: 10000
      });

      await this.continueShoppingButton.click();

    } catch (error) {

      // ----------------------------------------
      // Fallback: close modal
      // ----------------------------------------

      try {

        const closeButton =
          this.closeModalButton.first();

        await closeButton.waitFor({
          state: 'visible',
          timeout: 5000
        });

        await closeButton.click({
          force: true
        });

      } catch (closeError) {

        // --------------------------------------
        // Final fallback: press Escape
        // --------------------------------------

        try {
          await this.page.keyboard.press('Escape');
        } catch (escapeError) {
          // Modal may already be closed.
        }
      }
    }


    // ------------------------------------------
    // Verify modal is closed
    // ------------------------------------------

    try {

      await this.continueShoppingButton.waitFor({
        state: 'hidden',
        timeout: 5000
      });

    } catch (error) {
      // Modal may already be closed.
    }
  }


  // ==================================================
  // GO TO CART
  // ==================================================

  async goToCart() {

    await this.page.goto(
      '/view_cart',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );


    // ------------------------------------------
    // Verify cart page is loaded
    // ------------------------------------------

    await this.page.locator(
      '#cart_info_table'
    ).waitFor({
      state: 'visible',
      timeout: 20000
    });
  }
}