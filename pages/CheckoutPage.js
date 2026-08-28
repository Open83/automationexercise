export class CheckoutPage {
  constructor(page) {
    this.page = page;

    // ==================================================
    // CHECKOUT PAGE
    // ==================================================

    this.orderCommentTextarea = page.locator(
      'textarea[name="message"]'
    );

    this.placeOrderButton = page.getByRole(
      'link',
      {
        name: 'Place Order'
      }
    );


    // ==================================================
    // PAYMENT PAGE
    // ==================================================

    this.paymentPageHeading = page.getByRole(
      'heading',
      {
        name: 'Payment'
      }
    );

    this.nameOnCard = page.locator(
      'input[data-qa="name-on-card"]'
    );

    this.cardNumber = page.locator(
      'input[data-qa="card-number"]'
    );

    this.cvc = page.locator(
      'input[data-qa="cvc"]'
    );

    this.expiryMonth = page.locator(
      'input[data-qa="expiry-month"]'
    );

    this.expiryYear = page.locator(
      'input[data-qa="expiry-year"]'
    );

    this.payButton = page.getByRole(
      'button',
      {
        name: 'Pay and Confirm Order'
      }
    );


    // ==================================================
    // ORDER SUCCESS
    // ==================================================

    this.successMessage = page.getByRole(
      'heading',
      {
        name: 'Order Placed!'
      }
    );

    this.successText = page.getByText(
      'Congratulations! Your order has been confirmed!'
    );
  }


  // ==================================================
  // ADD COMMENT + PLACE ORDER
  // ==================================================

  async addOrderCommentAndPlaceOrder(comment) {

    // ------------------------------------------
    // Verify checkout page
    // ------------------------------------------

    await this.orderCommentTextarea.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Add order comment
    // ------------------------------------------

    await this.orderCommentTextarea.fill(comment);


    // ------------------------------------------
    // Verify Place Order button
    // ------------------------------------------

    await this.placeOrderButton.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Click Place Order
    // ------------------------------------------

    await this.placeOrderButton.click();


    // ------------------------------------------
    // Wait for payment page
    // ------------------------------------------

    await this.paymentPageHeading.waitFor({
      state: 'visible',
      timeout: 45000
    });


    // ------------------------------------------
    // Verify payment URL when possible
    // ------------------------------------------

    if (!this.page.url().includes('/payment')) {
      try {
        await this.page.waitForURL(
          '**/payment',
          {
            timeout: 15000
          }
        );
      } catch (error) {
        // Payment heading is the primary verification.
        // Some navigation timing can make URL waiting unnecessary.
      }
    }
  }


  // ==================================================
  // FILL PAYMENT DETAILS
  // ==================================================

  async fillPaymentDetails(payment) {

    // ------------------------------------------
    // Verify payment page
    // ------------------------------------------

    await this.paymentPageHeading.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Wait for payment form
    // ------------------------------------------

    await this.nameOnCard.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.cardNumber.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.cvc.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.expiryMonth.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await this.expiryYear.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Fill name
    // ------------------------------------------

    await this.nameOnCard.fill(
      payment.name
    );


    // ------------------------------------------
    // Fill card number
    // ------------------------------------------

    await this.cardNumber.fill(
      payment.cardNumber
    );


    // ------------------------------------------
    // Fill CVC
    // ------------------------------------------

    await this.cvc.fill(
      payment.cvc
    );


    // ------------------------------------------
    // Fill expiry month
    // ------------------------------------------

    await this.expiryMonth.fill(
      payment.month
    );


    // ------------------------------------------
    // Fill expiry year
    // ------------------------------------------

    await this.expiryYear.fill(
      payment.year
    );


    // ------------------------------------------
    // Verify payment values
    // ------------------------------------------

    await this.page.waitForFunction(() => {

      const name = document.querySelector(
        'input[data-qa="name-on-card"]'
      );

      const card = document.querySelector(
        'input[data-qa="card-number"]'
      );

      const cvc = document.querySelector(
        'input[data-qa="cvc"]'
      );

      const month = document.querySelector(
        'input[data-qa="expiry-month"]'
      );

      const year = document.querySelector(
        'input[data-qa="expiry-year"]'
      );

      return (
        name &&
        card &&
        cvc &&
        month &&
        year &&
        name.value.length > 0 &&
        card.value.length > 0 &&
        cvc.value.length > 0 &&
        month.value.length > 0 &&
        year.value.length > 0
      );
    }, null, {
      timeout: 10000
    });


    // ------------------------------------------
    // Verify Pay button
    // ------------------------------------------

    await this.payButton.waitFor({
      state: 'visible',
      timeout: 15000
    });


    // ------------------------------------------
    // Pay and confirm order
    // ------------------------------------------

    await this.payButton.click();


    // ------------------------------------------
    // Wait for order completion
    // ------------------------------------------

    await this.successMessage.waitFor({
      state: 'visible',
      timeout: 45000
    });


    // ------------------------------------------
    // Verify confirmation text
    // ------------------------------------------

    await this.successText.waitFor({
      state: 'visible',
      timeout: 15000
    });
  }
}