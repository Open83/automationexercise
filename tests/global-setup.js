import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import fs from 'fs';
import path from 'path';

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

  const diagnosticsDir =
    path.resolve(process.cwd(), 'auth-diagnostics');


  // ==================================================
  // PREPARE DIAGNOSTICS DIRECTORY
  // ==================================================

  fs.mkdirSync(
    diagnosticsDir,
    {
      recursive: true
    }
  );


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

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {

    let browser = null;
    let context = null;
    let page = null;

    try {

      console.log(
        '\n=========================================='
      );

      console.log(
        `Authentication attempt ${attempt}/${maxAttempts}`
      );

      console.log(
        '=========================================='
      );


      // ------------------------------------------
      // LAUNCH BROWSER
      // ------------------------------------------

      browser = await chromium.launch({
        headless: true
      });


      // ------------------------------------------
      // CREATE FRESH CONTEXT
      // ------------------------------------------

      context = await browser.newContext({
        viewport: {
          width: 1280,
          height: 720
        },

        userAgent:
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      });


      // ------------------------------------------
      // CREATE PAGE
      // ------------------------------------------

      page = await context.newPage();


      // ------------------------------------------
      // CREATE LOGIN PAGE OBJECT
      // ------------------------------------------

      const loginPage =
        new LoginPage(page);


      // ------------------------------------------
      // OPEN LOGIN PAGE
      // ------------------------------------------

      const loginURL =
        `${baseURL.replace(/\/$/, '')}/login`;

      console.log(
        `Opening login page: ${loginURL}`
      );


      const response =
        await page.goto(
          loginURL,
          {
            waitUntil: 'domcontentloaded',
            timeout: 45000
          }
        );


      // ------------------------------------------
      // LOG RESPONSE INFORMATION
      // ------------------------------------------

      console.log(
        `Login page response status: ${response?.status() ?? 'unknown'}`
      );

      console.log(
        `Login page URL: ${page.url()}`
      );

      console.log(
        `Login page title: ${await page.title()}`
      );


      // ------------------------------------------
      // WAIT FOR LOGIN PAGE
      // ------------------------------------------

      console.log(
        'Waiting for login form...'
      );


      await loginPage.loginEmailInput.waitFor({
        state: 'visible',
        timeout: 30000
      });


      await loginPage.loginPasswordInput.waitFor({
        state: 'visible',
        timeout: 30000
      });


      console.log(
        'Login form is visible.'
      );


      // ------------------------------------------
      // LOGIN
      // ------------------------------------------

      console.log(
        'Attempting login...'
      );


      await loginPage.login(
        email,
        password
      );


      // ------------------------------------------
      // VERIFY SUCCESSFUL LOGIN
      // ------------------------------------------

      console.log(
        'Waiting for authenticated account indicator...'
      );


      await page.getByText(
        'Logged in as',
        {
          exact: false
        }
      ).waitFor({
        state: 'visible',
        timeout: 30000
      });


      console.log(
        'Existing account login successful.'
      );


      // ------------------------------------------
      // SAVE STORAGE STATE
      // ------------------------------------------

      const storageStatePath =
        path.resolve(
          process.cwd(),
          'storageState.json'
        );


      console.log(
        'Saving authenticated storage state...'
      );


      await context.storageState({
        path: storageStatePath
      });


      console.log(
        `storageState.json created successfully: ${storageStatePath}`
      );


      // ------------------------------------------
      // CLOSE BROWSER
      // ------------------------------------------

      await browser.close();

      browser = null;


      console.log(
        'Authentication setup completed successfully.'
      );


      return;

    } catch (error) {

      lastError = error;


      // ------------------------------------------
      // LOG FAILURE
      // ------------------------------------------

      console.error(
        `Authentication attempt ${attempt} failed.`
      );

      console.error(
        error?.message || 'Unknown error'
      );


      // ------------------------------------------
      // SAVE DIAGNOSTICS
      // ------------------------------------------

      try {

        if (page) {

          const screenshotPath =
            path.join(
              diagnosticsDir,
              `auth-failure-attempt-${attempt}.png`
            );

          const htmlPath =
            path.join(
              diagnosticsDir,
              `auth-failure-attempt-${attempt}.html`
            );


          // --------------------------------------
          // PAGE INFORMATION
          // --------------------------------------

          console.error(
            `Diagnostic URL: ${page.url()}`
          );

          console.error(
            `Diagnostic title: ${await page.title()}`
          );


          // --------------------------------------
          // SCREENSHOT
          // --------------------------------------

          await page.screenshot({
            path: screenshotPath,
            fullPage: true
          });


          console.log(
            `Authentication screenshot saved: ${screenshotPath}`
          );


          // --------------------------------------
          // HTML
          // --------------------------------------

          const html =
            await page.content();


          fs.writeFileSync(
            htmlPath,
            html,
            'utf8'
          );


          console.log(
            `Authentication HTML saved: ${htmlPath}`
          );


          // --------------------------------------
          // SAVE URL INFORMATION
          // --------------------------------------

          const metadataPath =
            path.join(
              diagnosticsDir,
              `auth-failure-attempt-${attempt}.txt`
            );


          const metadata =
            [
              `Attempt: ${attempt}/${maxAttempts}`,
              `URL: ${page.url()}`,
              `Title: ${await page.title()}`,
              `Timestamp: ${new Date().toISOString()}`,
              '',
              'Error:',
              error?.stack || error?.message || 'Unknown error'
            ].join('\n');


          fs.writeFileSync(
            metadataPath,
            metadata,
            'utf8'
          );


          console.log(
            `Authentication metadata saved: ${metadataPath}`
          );
        }

      } catch (diagnosticError) {

        console.error(
          'Could not save authentication diagnostics:'
        );

        console.error(
          diagnosticError?.message ||
          'Unknown diagnostic error'
        );
      }


      // ------------------------------------------
      // CLOSE CONTEXT
      // ------------------------------------------

      try {

        if (context) {
          await context.close();
        }

      } catch (contextCloseError) {

        console.error(
          'Context close error:',
          contextCloseError?.message || ''
        );
      }


      // ------------------------------------------
      // CLOSE BROWSER
      // ------------------------------------------

      try {

        if (browser) {
          await browser.close();
        }

      } catch (browserCloseError) {

        console.error(
          'Browser close error:',
          browserCloseError?.message || ''
        );
      }


      // ------------------------------------------
      // WAIT BEFORE RETRY
      // ------------------------------------------

      if (attempt < maxAttempts) {

        console.log(
          'Waiting 5 seconds before retry...'
        );


        await new Promise(
          resolve =>
            setTimeout(resolve, 5000)
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