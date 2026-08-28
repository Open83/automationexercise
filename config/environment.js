require('dotenv').config();

const environment = {

    baseUrl: process.env.BASE_URL,

    apiBaseUrl: process.env.API_BASE_URL

};

module.exports = {
    environment
};