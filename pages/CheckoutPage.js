import { expect } from '@playwright/test';

export class CheckoutPage {

  constructor(page) {

    this.page = page;


    // ==================================================
    // CHECKOUT PAGE
    // ==================================================

    this.reviewOrderHeading = page.getByRole(
      'heading',
      {
        name: 'Review Your Order'
      }
    );


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
    // REVIEW ORDER PRODUCTS
    // ==================================================

    this.reviewOrderProductRows = page.locator(
      '#cart_info tbody tr'
    ).filter({
      has: page.locator(
        'a[href*="product_details"]'
      )
    });


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
    // VERIFY CHECKOUT PAGE
    // ------------------------------------------

    await this.reviewOrderHeading.waitFor({
      state: 'visible',
      timeout: 30000
    });


    await this.orderCommentTextarea.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // ADD ORDER COMMENT
    // ------------------------------------------

    await this.orderCommentTextarea.fill(
      comment
    );


    // ------------------------------------------
    // VERIFY PLACE ORDER BUTTON
    // ------------------------------------------

    await this.placeOrderButton.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // CLICK PLACE ORDER
    // ------------------------------------------

    await this.placeOrderButton.click();


    // ------------------------------------------
    // WAIT FOR PAYMENT PAGE
    // ------------------------------------------
    //
    // Automation Exercise may keep the URL as
    // /checkout#google_vignette while the Payment
    // section becomes available.
    //
    // The Payment heading is therefore used as
    // the synchronization point.
    // ------------------------------------------

    await this.paymentPageHeading.waitFor({
      state: 'visible',
      timeout: 45000
    });

  }


  // ==================================================
  // FILL PAYMENT DETAILS
  // ==================================================

  async fillPaymentDetails(payment) {

    // ------------------------------------------
    // VERIFY PAYMENT PAGE
    // ------------------------------------------

    await this.paymentPageHeading.waitFor({
      state: 'visible',
      timeout: 30000
    });


    // ------------------------------------------
    // WAIT FOR PAYMENT FORM
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
    // FILL NAME
    // ------------------------------------------

    await this.nameOnCard.fill(
      payment.name
    );


    // ------------------------------------------
    // FILL CARD NUMBER
    // ------------------------------------------

    await this.cardNumber.fill(
      payment.cardNumber
    );


    // ------------------------------------------
    // FILL CVC
    // ------------------------------------------

    await this.cvc.fill(
      payment.cvc
    );


    // ------------------------------------------
    // FILL EXPIRY MONTH
    // ------------------------------------------

    await this.expiryMonth.fill(
      payment.month
    );


    // ------------------------------------------
    // FILL EXPIRY YEAR
    // ------------------------------------------

    await this.expiryYear.fill(
      payment.year
    );


    // ------------------------------------------
    // VERIFY PAYMENT VALUES
    // ------------------------------------------

    await expect(
      this.nameOnCard
    ).toHaveValue(
      payment.name,
      {
        timeout: 10000
      }
    );


    await expect(
      this.cardNumber
    ).toHaveValue(
      payment.cardNumber,
      {
        timeout: 10000
      }
    );


    await expect(
      this.cvc
    ).toHaveValue(
      payment.cvc,
      {
        timeout: 10000
      }
    );


    await expect(
      this.expiryMonth
    ).toHaveValue(
      payment.month,
      {
        timeout: 10000
      }
    );


    await expect(
      this.expiryYear
    ).toHaveValue(
      payment.year,
      {
        timeout: 10000
      }
    );


    // ------------------------------------------
    // VERIFY PAY BUTTON
    // ------------------------------------------

    await this.payButton.waitFor({
      state: 'visible',
      timeout: 15000
    });


    // ------------------------------------------
    // PAY AND CONFIRM ORDER
    // ------------------------------------------

    await this.payButton.click();


    // ------------------------------------------
    // WAIT FOR ORDER COMPLETION
    // ------------------------------------------

    await this.successMessage.waitFor({
      state: 'visible',
      timeout: 45000
    });


    // ------------------------------------------
    // VERIFY CONFIRMATION TEXT
    // ------------------------------------------

    await this.successText.waitFor({
      state: 'visible',
      timeout: 15000
    });

  }

}