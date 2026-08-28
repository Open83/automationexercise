import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import fs from 'fs';

export default async () => {

  // ==================================================
  // CONFIGURATION
  // ==================================================

  const baseURL =
    process.env.BASE_URL ||
    'https://automationexercise.com';

  const email =
    process.env.EXISTING_TEST_EMAIL;

  const password =
    process.env.EXISTING_TEST_PASSWORD;

  const name =
    process.env.EXISTING_TEST_NAME ||
    'QA Test User';

  const maxAttempts = 3;


  // ==================================================
  // VALIDATE CREDENTIALS
  // ==================================================

  if (!email || !password) {
    throw new Error(
      'Environment variables EXISTING_TEST_EMAIL and EXISTING_TEST_PASSWORD must be set.'
    );
  }


  // ==================================================
  // LOGIN WITH RETRIES
  // ==================================================

  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {

    let browser = null;

    try {

      console.log(
        `\n==========================================`
      );

      console.log(
        `Authentication attempt ${attempt}/${maxAttempts}`
      );

      console.log(
        `==========================================`
      );


      // ------------------------------------------
      // Launch browser
      // ------------------------------------------

      browser = await chromium.launch({
        headless: true
      });


      // ------------------------------------------
      // Create fresh context
      // ------------------------------------------

      const context = await browser.newContext({
        viewport: {
          width: 1280,
          height: 720
        }
      });


      const page = await context.newPage();


      // ------------------------------------------
      // Create LoginPage
      // ------------------------------------------

      const loginPage = new LoginPage(page);


      // ------------------------------------------
      // Open login page
      // ------------------------------------------

      console.log(
        `Opening login page: ${baseURL}/login`
      );

      await page.goto(
        `${baseURL}/login`,
        {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        }
      );


      // ------------------------------------------
      // Wait for login form
      // ------------------------------------------

      console.log(
        'Waiting for login form...'
      );

      await loginPage.loginEmailInput.waitFor({
        state: 'visible',
        timeout: 15000
      });


      await loginPage.loginPasswordInput.waitFor({
        state: 'visible',
        timeout: 15000
      });


      // ------------------------------------------
      // Login
      // ------------------------------------------

      console.log(
        'Attempting login...'
      );

      await loginPage.login(
        email,
        password
      );


      // ------------------------------------------
      // Verify successful login
      // ------------------------------------------

      await page.getByText(
        'Logged in as',
        {
          exact: false
        }
      ).waitFor({
        state: 'visible',
        timeout: 15000
      });


      console.log(
        'Existing account login successful.'
      );


      // ------------------------------------------
      // Save storage state
      // ------------------------------------------

      console.log(
        'Saving authenticated storage state...'
      );

      await context.storageState({
        path: 'storageState.json'
      });


      console.log(
        'storageState.json created successfully.'
      );


      // ------------------------------------------
      // Close browser
      // ------------------------------------------

      await browser.close();


      console.log(
        'Authentication setup completed successfully.'
      );


      return;

    } catch (error) {

      lastError = error;

      console.error(
        `Authentication attempt ${attempt} failed.`
      );

      console.error(
        error.message
      );


      // ------------------------------------------
      // Save diagnostics
      // ------------------------------------------

      try {

        if (browser) {

          const pages =
            browser.contexts()
              .flatMap(context => context.pages());

          const page =
            pages[0];

          if (page) {

            await page.screenshot({
              path:
                `auth-failure-attempt-${attempt}.png`,
              fullPage: true
            });

            const html =
              await page.content();

            fs.writeFileSync(
              `auth-failure-attempt-${attempt}.html`,
              html
            );
          }
        }

      } catch (diagnosticError) {

        console.error(
          'Could not save authentication diagnostics:',
          diagnosticError.message
        );
      }


      // ------------------------------------------
      // Close browser
      // ------------------------------------------

      try {

        if (browser) {
          await browser.close();
        }

      } catch (closeError) {
        // Ignore browser close errors.
      }


      // ------------------------------------------
      // Wait before retry
      // ------------------------------------------

      if (attempt < maxAttempts) {

        console.log(
          'Waiting 5 seconds before retry...'
        );

        await new Promise(
          resolve => setTimeout(resolve, 5000)
        );
      }
    }
  }


  // ==================================================
  // ALL ATTEMPTS FAILED
  // ==================================================

  throw new Error(
    `Authentication setup failed after ${maxAttempts} attempts. ` +
    `Last error: ${lastError?.message || 'Unknown error'}`
  );
};