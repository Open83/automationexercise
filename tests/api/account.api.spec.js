const { test, expect } = require('../fixtures/account.fixture');

const { AccountApi } = require('../../api/AccountApi');


// ==================================================
// ACCOUNT API TEST SUITE
// ==================================================

test.describe('Account API', () => {


    // ==================================================
    // TEST 1 — GET USER DETAILS
    // ==================================================

    test(
        'should retrieve and verify a newly created account',
        async ({ account }) => {

            const { data, api } = account;


            // GET USER DETAILS
            const response =
                await api.getUserDetail(data.email);


            // Verify HTTP status
            expect(response.status()).toBe(200);


            // Read response body
            const body =
                await response.json();


            // Verify response code
            expect(body).toHaveProperty('responseCode');
            expect(body.responseCode).toBe(200);


            // Verify user exists
            expect(body).toHaveProperty('user');
            expect(body.user).toBeTruthy();


            // Verify user data
            expect(body.user.email)
                .toBe(data.email);

            expect(body.user.name)
                .toBe(data.name);

            expect(body.user.first_name)
                .toBe(data.firstname);

            expect(body.user.last_name)
                .toBe(data.lastname);

        }
    );


    // ==================================================
    // TEST 2 — UPDATE ACCOUNT
    // ==================================================

    test(
        'should update and verify account details',
        async ({ account }) => {

            const { data, api } = account;


            // Updated account data
            const updatedData = {
                ...data,

                company: 'Automation QA Lab',

                address1: 'Updated QA Test Address',

                city: 'Pune'
            };


            // UPDATE ACCOUNT
            const updateResponse =
                await api.updateAccount(updatedData);


            // Verify HTTP status
            expect(updateResponse.status()).toBe(200);


            // Read response body
            const updateBody =
                await updateResponse.json();


            // Verify response code
            expect(updateBody).toHaveProperty('responseCode');
            expect(updateBody.responseCode).toBe(200);


            // Verify update message
            expect(updateBody).toHaveProperty('message');
            expect(updateBody.message).toBe('User updated!');


            // ==========================================
            // GET UPDATED ACCOUNT
            // ==========================================

            const getResponse =
                await api.getUserDetail(data.email);


            // Verify HTTP status
            expect(getResponse.status()).toBe(200);


            // Read response body
            const getBody =
                await getResponse.json();


            // Verify response code
            expect(getBody).toHaveProperty('responseCode');
            expect(getBody.responseCode).toBe(200);


            // Verify user exists
            expect(getBody).toHaveProperty('user');
            expect(getBody.user).toBeTruthy();


            // ==========================================
            // VERIFY UPDATED DATA
            // ==========================================

            expect(getBody.user.company)
                .toBe(updatedData.company);

            expect(getBody.user.address1)
                .toBe(updatedData.address1);

            expect(getBody.user.city)
                .toBe(updatedData.city);

        }
    );


    // ==================================================
    // TEST 3 — DELETE ACCOUNT
    // ==================================================

    test(
        'should delete account and verify it no longer exists',
        async ({ account }) => {

            const { data, api } = account;


            // ==========================================
            // DELETE ACCOUNT
            // ==========================================

            const deleteResponse =
                await api.deleteAccount(
                    data.email,
                    data.password
                );


            // Verify HTTP status
            expect(deleteResponse.status()).toBe(200);


            // Read response body
            const deleteBody =
                await deleteResponse.json();


            // Verify response code
            expect(deleteBody).toHaveProperty('responseCode');
            expect(deleteBody.responseCode).toBe(200);


            // Verify deletion message
            expect(deleteBody).toHaveProperty('message');
            expect(deleteBody.message).toBe('Account deleted!');


            // IMPORTANT:
            // Tell the fixture that this account has already
            // been deleted. This prevents the fixture from
            // attempting to delete it a second time.

            account.deleted = true;


            // ==========================================
            // VERIFY ACCOUNT NO LONGER EXISTS
            // ==========================================

            const getResponse =
                await api.getUserDetail(data.email);


            // Read response body
            const getBody =
                await getResponse.json();


            // Verify response code
            expect(getBody).toHaveProperty('responseCode');
            expect(getBody.responseCode).toBe(404);


            // Verify actual API error message
            expect(getBody).toHaveProperty('message');

            expect(getBody.message).toBe(
                'Account not found with this email, try another email!'
            );

        }
    );


    // ==================================================
    // NEGATIVE TEST 1 — MISSING EMAIL
    // ==================================================

    test(
        'should reject account creation when email is missing',
        async ({ request }) => {

            // Create API client
            const api = new AccountApi(request);


            // ==========================================
            // INVALID ACCOUNT DATA
            // ==========================================

            // Email is intentionally missing.

            const invalidData = {

                name: 'QA Test User',

                firstname: 'QA',

                lastname: 'Tester',

                password: 'Test@12345',

                company: 'Automation QA Lab',

                address1: 'Test Address',

                country: 'India',

                zipcode: '400001',

                state: 'Maharashtra',

                city: 'Mumbai',

                mobile_number: '9876543210'
            };


            // ==========================================
            // SEND INVALID REQUEST
            // ==========================================

            const response =
                await api.createAccount(invalidData);


            // ==========================================
            // VERIFY HTTP STATUS
            // ==========================================

            expect(response.status()).toBe(200);


            // Read response body
            const body =
                await response.json();


            // ==========================================
            // VERIFY ERROR RESPONSE
            // ==========================================

            expect(body).toHaveProperty('responseCode');

            expect(body.responseCode).toBe(400);


            // Verify error message
            expect(body).toHaveProperty('message');

            expect(body.message).toBe(
                'Bad request, email parameter is missing in POST request.'
            );

        }
    );

    // ==================================================
// NEGATIVE TEST 2 — MISSING PASSWORD
// ==================================================

test(
    'should reject account creation when password is missing',
    async ({ request }) => {

        // Create API client
        const api = new AccountApi(request);


        // ==========================================
        // INVALID ACCOUNT DATA
        // ==========================================

        // Password is intentionally missing.

        const invalidData = {

            name: 'QA Test User',

            firstname: 'QA',

            lastname: 'Tester',

            email: `qa_missing_password_${Date.now()}@example.com`,

            company: 'Automation QA Lab',

            address1: 'Test Address',

            country: 'India',

            zipcode: '400001',

            state: 'Maharashtra',

            city: 'Mumbai',

            mobile_number: '9876543210'
        };


        // ==========================================
        // SEND INVALID REQUEST
        // ==========================================

        const response =
            await api.createAccount(invalidData);


        // ==========================================
        // VERIFY HTTP STATUS
        // ==========================================

        expect(response.status()).toBe(200);


        // Read response body
        const body =
            await response.json();


        // ==========================================
        // VERIFY ERROR RESPONSE
        // ==========================================

        expect(body).toHaveProperty('responseCode');

        expect(body.responseCode).toBe(400);


        expect(body).toHaveProperty('message');

        expect(body.message).toBe(
            'Bad request, password parameter is missing in POST request.'
        );

    }
);
// ==================================================
// NEGATIVE TEST 3 — DUPLICATE EMAIL
// ==================================================

test(
    'should reject account creation with an existing email',
    async ({ account }) => {

        // Get existing account data and API client
        const { data, api } = account;


        // ==========================================
        // CREATE SECOND ACCOUNT DATA
        // ==========================================

        // Keep the SAME email.
        // Change the other user information.

        const duplicateData = {

            name: 'Duplicate QA User',

            firstname: 'Duplicate',

            lastname: 'Tester',

            email: data.email,

            password: 'Another@12345',

            company: 'Duplicate QA Company',

            address1: 'Another Test Address',

            country: 'India',

            zipcode: '400001',

            state: 'Maharashtra',

            city: 'Mumbai',

            mobile_number: '9876543211'
        };


        // ==========================================
        // SEND DUPLICATE ACCOUNT REQUEST
        // ==========================================

        const response =
            await api.createAccount(duplicateData);


        // ==========================================
        // VERIFY HTTP STATUS
        // ==========================================

        expect(response.status()).toBe(200);


        // Read response body
        const body =
            await response.json();


        // ==========================================
        // VERIFY API ERROR
        // ==========================================

        expect(body).toHaveProperty('responseCode');

        expect(body.responseCode).toBe(400);


        expect(body).toHaveProperty('message');

        expect(body.message).toBe(
            'Email already exists!'
        );

    }
);

});