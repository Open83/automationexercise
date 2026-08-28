const { test, expect } = require('@playwright/test');
const { ProductsApi } = require('../../api/ProductsApi');

test.describe('Products API', () => {

    test('GET products list should return valid products', async ({ request }) => {

    // Create Products API client
    const productsApi = new ProductsApi(request);

    // Send GET products request through ProductsApi
    const response = await productsApi.getProducts();

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify response structure
    expect(body).toHaveProperty('products');

    // Verify products is an array
    expect(Array.isArray(body.products)).toBeTruthy();

    // Verify products were returned
    expect(body.products.length).toBeGreaterThan(0);
});

    test('POST search product should return matching products', async ({ request }) => {

    // Create Products API client
    const productsApi = new ProductsApi(request);

    // Search for a product
    const response = await productsApi.searchProduct('top');

    // Verify HTTP status
    expect(response.status()).toBe(200);

    // Read response body
    const body = await response.json();

    // Verify response structure
    expect(body).toHaveProperty('products');

    // Verify products is an array
    expect(Array.isArray(body.products)).toBeTruthy();

    // Verify search returned results
    expect(body.products.length).toBeGreaterThan(0);
});


  test('POST search product should handle missing search_product parameter', async ({ request }) => {

    // Create Products API client
    const productsApi = new ProductsApi(request);

    // Send search request without search_product
    const response =
        await productsApi.searchProductWithoutParameter();

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
        'Bad request, search_product parameter is missing in POST request.'
    );
});

test(
    'GET brands list should return valid brands',
    async ({ request }) => {

        // Create Products API client
        const productsApi = new ProductsApi(request);


        // Send GET brands request
        const response =
            await productsApi.getBrands();


        // Verify HTTP status
        expect(response.status()).toBe(200);


        // Read response body
        const body =
            await response.json();


        // Verify response structure
        expect(body).toHaveProperty('brands');


        // Verify brands is an array
        expect(Array.isArray(body.brands)).toBeTruthy();


        // Verify at least one brand exists
        expect(body.brands.length).toBeGreaterThan(0);


        // Verify brand object structure
        expect(body.brands[0]).toHaveProperty('id');

        expect(body.brands[0]).toHaveProperty('brand');

    }
);

// ==================================================
// NEGATIVE TEST — UNSUPPORTED HTTP METHOD
// ==================================================

test(
    'POST products list should reject unsupported HTTP method',
    async ({ request }) => {

        // Create Products API client
        const productsApi = new ProductsApi(request);


        // Send POST request to GET-only endpoint
        const response =
            await productsApi.postProductsList();


        // ==========================================
        // VERIFY HTTP STATUS
        // ==========================================

        // Automation Exercise returns HTTP 200
        // and places the actual API error code
        // inside the response body.

        expect(response.status()).toBe(200);


        // Read response body
        const body =
            await response.json();


        // ==========================================
        // VERIFY API RESPONSE CODE
        // ==========================================

        expect(body).toHaveProperty('responseCode');

        expect(body.responseCode).toBe(405);


        // ==========================================
        // VERIFY ERROR MESSAGE
        // ==========================================

        expect(body).toHaveProperty('message');

        expect(body.message).toBe(
            'This request method is not supported.'
        );

    }
);
});