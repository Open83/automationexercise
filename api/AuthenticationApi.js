const { environment } = require('../config/environment');
class AuthenticationApi {

    constructor(request) {
        this.request = request;
        this.baseUrl = environment.apiBaseUrl;
    }

    async verifyLogin(email, password) {

        return await this.request.post(
            `${this.baseUrl}/verifyLogin`,
            {
                form: {
                    email,
                    password
                }
            }
        );
    }

    async verifyLoginWithoutEmail(password) {

        return await this.request.post(
            `${this.baseUrl}/verifyLogin`,
            {
                form: {
                    password
                }
            }
        );
    }

    async verifyLoginWithoutPassword(email) {

        return await this.request.post(
            `${this.baseUrl}/verifyLogin`,
            {
                form: {
                    email
                }
            }
        );
    }

    async verifyLoginWithInvalidCredentials() {

        return await this.request.post(
            `${this.baseUrl}/verifyLogin`,
            {
                form: {
                    email: 'invalid-user@example.com',
                    password: 'WrongPassword123!'
                }
            }
        );
    }

    async deleteVerifyLogin() {

        return await this.request.delete(
            `${this.baseUrl}/verifyLogin`
        );
    }

}

module.exports = { AuthenticationApi };