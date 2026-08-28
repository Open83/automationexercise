import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import fs from 'fs';

export default async () => {

  const browser = await chromium.launch();

  const context = await browser.newContext();

  const page = await context.newPage();

  const loginPage = new LoginPage(page);


  // ==================================================
  // ENVIRONMENT VARIABLES
  // ==================================================

  const email = process.env.EXISTING_TEST_EMAIL;
  const password = process.env.EXISTING_TEST_PASSWORD;

  const baseUrl =
    process.env.BASE_URL ||
    'https://automationexercise.com';


  if (!email || !password) {

    await browser.close();

    throw new Error(
      'EXISTING_TEST_EMAIL and EXISTING_TEST_PASSWORD must be set.'
    );
  }


  // ==================================================
  // OPEN LOGIN PAGE
  // ==================================================

  const loginUrl = `${baseUrl}/login`;

  console.log(`Opening login page: ${loginUrl}`);


  try {

    await page.goto(loginUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

  } catch (error) {

    console.log(
      'Initial navigation timed out. Checking whether the page loaded...'
    );

    console.log(
      `Current URL: ${page.url()}`
    );


    // Sometimes Automation Exercise responds slowly,
    // but the page is already usable.

    if (!page.url().includes('/login')) {

      await page.goto(loginUrl, {
        waitUntil: 'commit',
        timeout: 60000
      });
    }
  }


  // ==================================================
  // LOGIN
  // ==================================================

  console.log('Attempting login...');


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
        timeout: 15000
      }
    );

    console.log(
      'Existing account login successful.'
    );

  } catch (loginError) {

    console.log(
      'Existing login was not successful.'
    );


    // ==================================================
    // CHECK LOGIN ERROR
    // ==================================================

    const loginErrorVisible =
      await loginPage.loginError
        .isVisible()
        .catch(() => false);


    if (!loginErrorVisible) {

      await page.screenshot({
        path: 'auth-failure.png',
        fullPage: true
      });


      fs.writeFileSync(
        'auth-failure.html',
        await page.content()
      );


      await browser.close();


      throw new Error(
        'Login did not succeed and no login error was displayed. ' +
        'Saved auth-failure.png and auth-failure.html.'
      );
    }


    // ==================================================
    // ATTEMPT ACCOUNT CREATION
    // ==================================================

    console.log(
      'Login credentials were rejected. Attempting signup...'
    );


    const accountPage = new AccountPage(page);

    const name =
      process.env.EXISTING_TEST_NAME ||
      'QA Test User';


    try {

      // ------------------------------------------
      // START SIGNUP
      // ------------------------------------------

      await loginPage.startSignup(
        name,
        email
      );


      // ------------------------------------------
      // ACCOUNT INFORMATION PAGE
      // ------------------------------------------

      await page.waitForSelector(
        'h2:has-text("Enter Account Information")',
        {
          timeout: 15000
        }
      );


      // ------------------------------------------
      // ACCOUNT DETAILS
      // ------------------------------------------

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

        mobile: '9999999999'
      };


      // ------------------------------------------
      // FILL ACCOUNT
      // ------------------------------------------

      await accountPage.fillAccountDetails(
        details
      );


      // ------------------------------------------
      // CREATE ACCOUNT
      // ------------------------------------------

      await accountPage.continueButton.click();


      // ------------------------------------------
      // VERIFY ACCOUNT LOGIN
      // ------------------------------------------

      await page.waitForSelector(
        'text=Logged in as',
        {
          timeout: 15000
        }
      );


      console.log(
        'Account created and logged in successfully.'
      );

    } catch (signupError) {

      await page.screenshot({
        path: 'auth-failure.png',
        fullPage: true
      });


      fs.writeFileSync(
        'auth-failure.html',
        await page.content()
      );


      await browser.close();


      throw new Error(
        'Signup/login attempt failed. ' +
        'Saved auth-failure.png and auth-failure.html for inspection.'
      );
    }
  }


  // ==================================================
  // SAVE AUTHENTICATED STORAGE STATE
  // ==================================================

  console.log(
    'Saving authenticated storage state...'
  );


  await context.storageState({
    path: 'storageState.json'
  });


  console.log(
    'storageState.json created successfully.'
  );


  // ==================================================
  // CLOSE BROWSER
  // ==================================================

  await browser.close();
};