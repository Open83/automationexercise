function generateAccountData() {

    const timestamp = Date.now();

    return {
        name: `Asif QA ${timestamp}`,
        email: `asif.qa.${timestamp}@example.com`,
        password: 'TestPassword123!',
        title: 'Mr',
        birth_date: '15',
        birth_month: '8',
        birth_year: '1995',
        firstname: 'Asif',
        lastname: 'QA',
        company: 'QA Portfolio Testing',
        address1: 'Test Address 123',
        address2: '',
        country: 'India',
        zipcode: '400001',
        state: 'Maharashtra',
        city: 'Mumbai',
        mobile_number: '9999999999'
    };
}

module.exports = { generateAccountData };