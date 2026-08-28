import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import fs from 'fs';

export default async () => {

  // ==================================================
  // SKIP UI GLOBAL SETUP FOR API TESTS IN CI
  // ==================================================

  if (process.env.SKIP_GLOBAL_SETUP === 'true') {
    console.log('Skipping UI global setup for API tests.');
    return;
  }


  // ==================================================
  // START BROWSER
  // ==================================================

  const browser = await chromium.launch();

  const context = await browser.newContext();

  const page = await context.newPage();


  // ==================================================
  // CREATE LOGIN PAGE
  // ==================================================

  const loginPage = new LoginPage(page);


  // ==================================================
  // GET LOGIN CREDENTIALS
  // ==================================================

  const email = process.env.EXISTING_TEST_EMAIL;

  const password = process.env.EXISTING_TEST_PASSWORD;


  // ==================================================
  // VERIFY CREDENTIALS
  // ==================================================

  if (!email || !password) {

    await browser.close();

    throw new Error(
      'Environment variables EXISTING_TEST_EMAIL and EXISTING_TEST_PASSWORD must be set for global-setup to create storageState.json'
    );
  }


  // ==================================================
  // LOGIN
  // ==================================================

  await page.goto(
    'https://automationexercise.com/login'
  );

  await loginPage.login(
    email,
    password
  );


  // ==================================================
  // VERIFY LOGIN
  // ==================================================

  try {

    await page.waitForSelector(
      'text=Logged in as',
      {
        timeout: 10000
      }
    );

  } catch (err) {

    // Login didn't show the logged-in banner.
    // Try to register the account if possible.

    const loginErrorVisible =
      await loginPage.loginError
        .isVisible()
        .catch(() => false);


    // ==================================================
    // SIGNUP FALLBACK
    // ==================================================

    if (loginErrorVisible) {

      const accountPage =
        new AccountPage(page);

      const name =
        process.env.EXISTING_TEST_NAME ||
        'QA Test User';


      try {

        await loginPage.startSignup(
          name,
          email
        );


        await page.waitForSelector(
          'h2:has-text("Enter Account Information")',
          {
            timeout: 8000
          }
        );


        // ==============================================
        // ACCOUNT DETAILS
        // ==============================================

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


        await accountPage.fillAccountDetails(
          details
        );


        await accountPage.continueButton.click();


        await page.waitForSelector(
          'text=Logged in as',
          {
            timeout: 10000
          }
        );


      } catch (signupErr) {

        // ==============================================
        // SAVE DIAGNOSTICS
        // ==============================================

        await page.screenshot({
          path: 'auth-failure.png',
          fullPage: true
        });


        const html =
          await page.content();


        fs.writeFileSync(
          'auth-failure.html',
          html
        );


        await browser.close();


        throw new Error(
          'Signup/login attempt failed. Saved auth-failure.png and auth-failure.html for inspection.'
        );
      }


    } else {

      // ==============================================
      // LOGIN FAILED — SAVE DIAGNOSTICS
      // ==============================================

      await page.screenshot({
        path: 'auth-failure.png',
        fullPage: true
      });


      const html =
        await page.content();


      fs.writeFileSync(
        'auth-failure.html',
        html
      );


      await browser.close();


      throw new Error(
        'Login did not succeed and signup was not attempted. Saved auth-failure.png and auth-failure.html for inspection.'
      );
    }
  }


  // ==================================================
  // SAVE STORAGE STATE
  // ==================================================

  await context.storageState({
    path: 'storageState.json'
  });


  // ==================================================
  // CLOSE BROWSER
  // ==================================================

  await browser.close();
};