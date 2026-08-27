export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.orderCommentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');

    this.nameOnCard = page.locator('input[data-qa="name-on-card"]');
    this.cardNumber = page.locator('input[data-qa="card-number"]');
    this.cvc = page.locator('input[data-qa="cvc"]');
    this.expiryMonth = page.locator('input[data-qa="expiry-month"]');
    this.expiryYear = page.locator('input[data-qa="expiry-year"]');
    this.payButton = page.locator('button[data-qa="pay-button"]');

    this.successMessage = page.getByRole('heading', { name: 'Order Placed!' });
  }

  async addOrderCommentAndPlaceOrder(comment) {
    await this.orderCommentTextarea.fill(comment);
    await Promise.all([
      this.page.waitForURL(/.*payment.*/,{ timeout: 10000 }).catch(() => {}),
      this.placeOrderButton.click({ force: true }),
    ]);
  }

  async fillPaymentDetails(payment) {
    // Try to fill payment inside a payment iframe (stripe/pay) if present
    const frameSelectors = ['iframe[src*="stripe"]', 'iframe[name*="stripe"]', 'iframe[src*="payment"]', 'iframe.payment-frame'];
    let filledInFrame = false;
    for (const sel of frameSelectors) {
      const frames = await this.page.$$(sel);
      if (frames.length) {
        const frame = this.page.frameLocator(sel);
        try {
          if (await frame.locator('input[name="cardnumber"]').count()) {
            await frame.locator('input[name="name"]').fill(payment.name);
            await frame.locator('input[name="cardnumber"]').fill(payment.cardNumber);
            await frame.locator('input[name="cvc"]').fill(payment.cvc);
            await frame.locator('input[name="exp-month"]').fill(payment.month);
            await frame.locator('input[name="exp-year"]').fill(payment.year);
            // Try clicking pay inside frame if button present
            if (await frame.locator('button:has-text("Pay"), button:has-text("Pay Now")').count()) {
              await frame.locator('button:has-text("Pay"), button:has-text("Pay Now")').first().click({ force: true });
            }
            filledInFrame = true;
            break;
          }
        } catch (e) {
          // ignore and try next
        }
      }
    }

    if (!filledInFrame) {
      await this.nameOnCard.fill(payment.name);
      await this.cardNumber.fill(payment.cardNumber);
      await this.cvc.fill(payment.cvc);
      await this.expiryMonth.fill(payment.month);
      await this.expiryYear.fill(payment.year);
      await Promise.all([
        this.page.waitForURL(/.*payment_done.*/, { timeout: 20000 }),
        this.payButton.click({ force: true }),
      ]);
    }
  }
}
