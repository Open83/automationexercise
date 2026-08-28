import { expect } from '@playwright/test';
export class CheckoutPage {

  constructor(page) {

    this.page = page;


    // ==================================================
    // CHECKOUT PAGE
    // ==================================================

    this.orderCommentTextarea = page.locator(
      'textarea[name="message"]'
    );

    this.placeOrderButton = page.getByRole('link', {
      name: 'Place Order'
    });


    // ==================================================
    // PAYMENT PAGE
    // ==================================================

    this.paymentPageHeading = page.getByRole('heading', {
      name: 'Payment'
    });

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

    this.payButton = page.getByRole('button', {
      name: 'Pay and Confirm Order'
    });


    // ==================================================
    // ORDER SUCCESS
    // ==================================================

    this.successMessage = page.getByRole('heading', {
      name: 'Order Placed!'
    });

    this.successText = page.getByText(
      'Congratulations! Your order has been confirmed!'
    );
  }


  // ==================================================
  // ADD COMMENT + PLACE ORDER
  // ==================================================

  async addOrderCommentAndPlaceOrder(comment) {

    // ------------------------------------------
    // Wait for order comment field
    // ------------------------------------------

    await this.orderCommentTextarea.waitFor({
      state: 'visible',
      timeout: 15000
    });


    // ------------------------------------------
    // Enter order comment
    // ------------------------------------------

    await this.orderCommentTextarea.fill(
      comment
    );


    // ------------------------------------------
    // Wait for Place Order button
    // ------------------------------------------

    await this.placeOrderButton.waitFor({
      state: 'visible',
      timeout: 15000
    });


    // ------------------------------------------
    // Place order
    // ------------------------------------------
    //
    // Do NOT wait for /payment URL here.
    //
    // Automation Exercise can sometimes display
    // an advertisement/interstitial first.
    //
    // Instead, we wait for the actual payment
    // form to become available.
    // ------------------------------------------

    await this.placeOrderButton.click();


    // ------------------------------------------
    // Wait for payment form
    // ------------------------------------------

    await this.nameOnCard.waitFor({
      state: 'visible',
      timeout: 45000
    });


    await this.cardNumber.waitFor({
      state: 'visible',
      timeout: 15000
    });


    await this.cvc.waitFor({
      state: 'visible',
      timeout: 15000
    });


    await this.expiryMonth.waitFor({
      state: 'visible',
      timeout: 15000
    });


    await this.expiryYear.waitFor({
      state: 'visible',
      timeout: 15000
    });

  }


  // ==================================================
  // FILL PAYMENT DETAILS
  // ==================================================

  async fillPaymentDetails(payment) {

    // ------------------------------------------
    // Wait for payment heading
    // ------------------------------------------

    await this.paymentPageHeading.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // Wait for payment fields
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
    // Fill name on card
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

    await expect(
      this.nameOnCard
    ).toHaveValue(
      payment.name
    );


    await expect(
      this.cardNumber
    ).toHaveValue(
      payment.cardNumber
    );


    await expect(
      this.cvc
    ).toHaveValue(
      payment.cvc
    );


    await expect(
      this.expiryMonth
    ).toHaveValue(
      payment.month
    );


    await expect(
      this.expiryYear
    ).toHaveValue(
      payment.year
    );


    // ------------------------------------------
    // Wait for Pay button
    // ------------------------------------------

    await this.payButton.waitFor({
      state: 'visible',
      timeout: 15000
    });


    // ------------------------------------------
    // Click Pay and Confirm Order
    // ------------------------------------------

    await this.payButton.click();


    // ------------------------------------------
    // Wait for order confirmation
    // ------------------------------------------

    await this.successMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });

  }

}