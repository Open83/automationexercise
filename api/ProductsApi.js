
const { environment } = require('../config/environment');
class ProductsApi {

    constructor(request) {
        this.request = request;
       this.baseUrl = environment.apiBaseUrl;
    }


    // ==================================================
    // GET PRODUCTS
    // ==================================================

    async getProducts() {

        return await this.request.get(
            `${this.baseUrl}/productsList`
        );
    }


    // ==================================================
    // SEARCH PRODUCT
    // ==================================================

    async searchProduct(product) {

        return await this.request.post(
            `${this.baseUrl}/searchProduct`,
            {
                form: {
                    search_product: product
                }
            }
        );
    }


    // ==================================================
    // SEARCH PRODUCT — MISSING PARAMETER
    // ==================================================

    async searchProductWithoutParameter() {

        return await this.request.post(
            `${this.baseUrl}/searchProduct`,
            {
                form: {}
            }
        );
    }


    // ==================================================
    // GET BRANDS
    // ==================================================

    async getBrands() {

        return await this.request.get(
            `${this.baseUrl}/brandsList`
        );
    }


    // ==================================================
    // POST PRODUCTS LIST — UNSUPPORTED METHOD
    // ==================================================

    async postProductsList() {

        return await this.request.post(
            `${this.baseUrl}/productsList`
        );
    }

}


module.exports = { ProductsApi };