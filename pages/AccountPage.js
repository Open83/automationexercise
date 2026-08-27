export class AccountPage {
  constructor(page) {
    this.page = page;

    this.password = page.locator('#password');
    this.days = page.locator('#days');
    this.months = page.locator('#months');.
    this.years = page.locator('#years');
    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.address1 = page.locator('#address1');
    this.country = page.locator('#country');
    this.state = page.locator('#state');
    this.city = page.locator('#city');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
  }

  async fillAccountDetails(details) {
    await this.password.fill(details.password);
    await this.days.selectOption(details.day);
    await this.months.selectOption(details.month);
    await this.years.selectOption(details.year);
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.address1.fill(details.address);
    await this.country.selectOption(details.country);
    await this.state.fill(details.state);
    await this.city.fill(details.city);
    await this.zipcode.fill(details.zipcode);
    await this.mobileNumber.fill(details.mobile);
    await this.createAccountButton.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }
}
