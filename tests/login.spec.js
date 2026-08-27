import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { generateTestUser } from './utils/testData';

test.describe('Login & Signup', () => {
  test('should register a new user and allow the account to be deleted', async ({ page }) => {
    const user = generateTestUser();
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.startSignup(user.name, user.email);

    await expect(page.locator('h2:has-text("Enter Account Information")')).toBeVisible();

    await accountPage.fillAccountDetails(user);
    await expect(accountPage.accountCreatedHeading).toBeVisible();

    await accountPage.continueButton.click();
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // Clean up so this test can run again without leaving junk accounts behind
    await accountPage.deleteAccount();
    await expect(accountPage.accountDeletedHeading).toBeVisible();
  });

  test('should show an error when signing up with an already registered email', async ({ page }) => {
    test.skip(!process.env.EXISTING_TEST_EMAIL, 'Set EXISTING_TEST_EMAIL to an account that already exists.');
    const existingEmail = process.env.EXISTING_TEST_EMAIL;
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.startSignup('Duplicate Signup Test', existingEmail);

    await expect(loginPage.signupError).toBeVisible();
  });

  test('should show an error for invalid login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('nonexistent.user@example.com', 'wrongPassword123');

    await expect(loginPage.loginError).toBeVisible();
  });

  test('should remain on the login page when submitting empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/.*login/);
  });
});
