import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  const email = process.env.EXISTING_TEST_EMAIL;
  const password = process.env.EXISTING_TEST_PASSWORD;
  if (!email || !password) {
    await browser.close();
    throw new Error('Environment variables EXISTING_TEST_EMAIL and EXISTING_TEST_PASSWORD must be set for global-setup to create storageState.json');
  }

  await page.goto('https://automationexercise.com/login');
  await loginPage.login(email, password);
  try {
    await page.waitForSelector('text=Logged in as', { timeout: 10000 });
  } catch (err) {
    // Login didn't show the logged-in banner. Try to register the account if possible.
    const loginErrorVisible = await loginPage.loginError.isVisible().catch(() => false);
    if (loginErrorVisible) {
      // Attempt signup flow using AccountPage
      const accountPage = new AccountPage(page);
      const name = process.env.EXISTING_TEST_NAME || 'QA Test User';
      try {
        await loginPage.startSignup(name, email);
        await page.waitForSelector('h2:has-text("Enter Account Information")', { timeout: 8000 });

        const details = {
          password,
          day: '10',
          month: '5',
          year: '1995',
          firstName: 'QA',
          lastName: 'Tester',
          address: '123 Test Street',
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
          zipcode: '90001',
          mobile: '9999999999',
        };

        await accountPage.fillAccountDetails(details);
        await accountPage.continueButton.click();
        await page.waitForSelector('text=Logged in as', { timeout: 10000 });
      } catch (signupErr) {
        // Save diagnostics and fail with a helpful message
        await page.screenshot({ path: 'auth-failure.png', fullPage: true });
        const html = await page.content();
        const fs = require('fs');
        fs.writeFileSync('auth-failure.html', html);
        await browser.close();
        throw new Error('Signup/login attempt failed. Saved auth-failure.png and auth-failure.html for inspection.');
      }
    } else {
      await page.screenshot({ path: 'auth-failure.png', fullPage: true });
      const html = await page.content();
      const fs = require('fs');
      fs.writeFileSync('auth-failure.html', html);
      await browser.close();
      throw new Error('Login did not succeed and signup was not attempted. Saved auth-failure.png and auth-failure.html for inspection.');
    }
  }

  await context.storageState({ path: 'storageState.json' });
  await browser.close();
};
