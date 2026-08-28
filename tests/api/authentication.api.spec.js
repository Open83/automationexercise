const { test, expect } = require('@playwright/test');
const { AuthenticationApi } = require('../../api/AuthenticationApi');

test.describe('Authentication API', () => {

test('POST verifyLogin should authenticate a valid user', async ({ request }) => {

    const email = process.env.EXISTING_TEST_EMAIL;
    const password = process.env.EXISTING_TEST_PASSWORD;

    // Verify that required environment variables are available
    expect(
        email,
        'EXISTING_TEST_EMAIL is not configured'
    ).toBeTruthy();

    expect(
        password,
        'EXISTING_TEST_PASSWORD is not configured'
    ).toBeTruthy();

    // Create Authentication API client
    const authenticationApi = new AuthenticationApi(request);

    // Send login request through AuthenticationApi
    const response = await authenticationApi.verifyLogin(
        email,
        password
    );

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify application response code
    expect(body).toHaveProperty('responseCode');
    expect(body.responseCode).toBe(200);

    // Verify success message
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('User exists!');
});

test('POST verifyLogin should reject invalid credentials', async ({ request }) => {

    // Create Authentication API client
    const authenticationApi = new AuthenticationApi(request);

    // Send invalid login request through AuthenticationApi
    const response =
        await authenticationApi.verifyLoginWithInvalidCredentials();

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify application-level error code
    expect(body).toHaveProperty('responseCode');
    expect(body.responseCode).toBe(404);

    // Verify error message
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('User not found!');
});
test('POST verifyLogin should handle missing email parameter', async ({ request }) => {

    // Create Authentication API client
    const authenticationApi = new AuthenticationApi(request);

    // Send request without email
    const response =
        await authenticationApi.verifyLoginWithoutEmail(
            'WrongPassword123!'
        );

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify application-level error code
    expect(body).toHaveProperty('responseCode');
    expect(body.responseCode).toBe(400);

    // Verify error message
    expect(body).toHaveProperty('message');
    expect(body.message).toBe(
        'Bad request, email or password parameter is missing in POST request.'
    );
});

test('POST verifyLogin should handle missing password parameter', async ({ request }) => {

    // Create Authentication API client
    const authenticationApi = new AuthenticationApi(request);

    // Send request without password
    const response =
        await authenticationApi.verifyLoginWithoutPassword(
            'invalid-user@example.com'
        );

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify application-level error code
    expect(body).toHaveProperty('responseCode');
    expect(body.responseCode).toBe(400);

    // Verify error message
    expect(body).toHaveProperty('message');
    expect(body.message).toBe(
        'Bad request, email or password parameter is missing in POST request.'
    );
});

test('DELETE verifyLogin should reject unsupported HTTP method', async ({ request }) => {

    // Create Authentication API client
    const authenticationApi = new AuthenticationApi(request);

    // Send unsupported DELETE request
    const response =
        await authenticationApi.deleteVerifyLogin();

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify application-level error code
    expect(body).toHaveProperty('responseCode');
    expect(body.responseCode).toBe(405);

    // Verify error message
    expect(body).toHaveProperty('message');
    expect(body.message).toBe(
        'This request method is not supported.'
    );
});

});