// Generates a unique, throwaway user for tests that create + delete their own account.
export function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: `QA Tester ${timestamp}`,
    email: `qatester.${timestamp}@mailinator.com`,
    password: 'Test@1234',
    day: '10',
    month: '5',
    year: '1995',
    firstName: 'QA',
    lastName: 'Tester',
    address: '123 Test Street',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile: '9999999999',
  };
}
