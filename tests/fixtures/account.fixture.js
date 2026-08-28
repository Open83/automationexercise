const { test: base, expect } = require('@playwright/test');

const { AccountApi } = require('../../api/AccountApi');

const { generateAccountData } = require('../../test-data/accountData');


// ==================================================
// ACCOUNT FIXTURE
// ==================================================

const test = base.extend({

    account: async ({ request }, use) => {

        // ==========================================
        // STEP 1 — GENERATE UNIQUE TEST DATA
        // ==========================================

        const userData = generateAccountData();


        // ==========================================
        // STEP 2 — CREATE API CLIENT
        // ==========================================

        const accountApi = new AccountApi(request);


        // ==========================================
        // STEP 3 — CREATE ACCOUNT
        // ==========================================

        const createResponse =
            await accountApi.createAccount(userData);


        // Verify HTTP status
        expect(createResponse.status()).toBe(200);


        // Read response body
        const createBody =
            await createResponse.json();


        // Verify application response
        expect(createBody).toHaveProperty('responseCode');
        expect(createBody.responseCode).toBe(201);


        // Verify success message
        expect(createBody).toHaveProperty('message');
        expect(createBody.message).toBe('User created!');


        // ==========================================
        // STEP 4 — CREATE ACCOUNT OBJECT
        // ==========================================

        const account = {

            // Test account data
            data: userData,

            // API client
            api: accountApi,

            // Track whether account was deleted
            deleted: false

        };


        // ==========================================
        // STEP 5 — PROVIDE ACCOUNT TO TEST
        // ==========================================

        await use(account);


        // ==========================================
        // STEP 6 — AUTOMATIC CLEANUP
        // ==========================================

        if (!account.deleted) {

            const deleteResponse =
                await accountApi.deleteAccount(
                    userData.email,
                    userData.password
                );

            expect(deleteResponse.status()).toBe(200);

            const deleteBody =
                await deleteResponse.json();

            expect(deleteBody.responseCode).toBe(200);

            expect(deleteBody.message).toBe('Account deleted!');
        }

    }

});



// ==================================================
// EXPORT
// ==================================================

module.exports = {
    test,
    expect
};