
const { environment } = require('../config/environment');
class AccountApi {

    constructor(request) {
        this.request = request;
        this.baseUrl = environment.apiBaseUrl;
    }


    async createAccount(userData) {

        return await this.request.post(
            `${this.baseUrl}/createAccount`,
            {
                form: userData
            }
        );
    }


    async getUserDetail(email) {

        return await this.request.get(
            `${this.baseUrl}/getUserDetailByEmail`,
            {
                params: {
                    email
                }
            }
        );
    }


    async updateAccount(userData) {

        return await this.request.put(
            `${this.baseUrl}/updateAccount`,
            {
                form: userData
            }
        );
    }


    async deleteAccount(email, password) {

        return await this.request.delete(
            `${this.baseUrl}/deleteAccount`,
            {
                form: {
                    email,
                    password
                }
            }
        );
    }

}


module.exports = { AccountApi };