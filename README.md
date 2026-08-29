# Automation Exercise – Playwright Test Suite

Automated end-to-end and API regression test suite for [Automation Exercise](https://automationexercise.com/), a public practice e-commerce application.

This project is built as a QA automation portfolio project to demonstrate structured test planning, manual test documentation, API testing, UI automation, Page Object Model design, regression execution, and CI/CD with GitHub Actions.

## Test Execution Status

**Latest verified local execution:**

- **26 tests passed**
- **0 failed**
- **0 flaky**
- **0 skipped**
- **Browser:** Chromium
- **Execution:** Playwright Test
- **Workers:** 1

The suite includes UI and API coverage across account, authentication, products, cart, checkout, and login/signup scenarios.

## What This Project Covers

### Login & Signup
- New user registration
- Duplicate email handling
- Invalid login credentials
- Empty-field submission
- Account deletion after registration

### Cart
- Add a single product to the cart
- Add multiple products and verify item count
- Remove a product from the cart
- Prevent guest users from proceeding directly to checkout

### Checkout
- Complete a full order as a logged-in user
- Verify products and quantities during order review
- Add an order comment
- Place an order successfully

### API Testing
API automation covers core application endpoints, including:

- Account creation, retrieval, update, and deletion
- Authentication / login verification
- Products API
- Product search
- Brands API
- Negative API scenarios such as missing parameters, invalid credentials, unsupported methods, and duplicate email handling

## Test Architecture

The UI automation is structured using the **Page Object Model (POM)** to keep page interactions separate from test scenarios and improve maintainability.

The project also separates API tests from UI tests and uses reusable fixtures/utilities for common setup and test data.

## Tech Stack

| Area | Technology |
|---|---|
| UI Automation | Playwright |
| Programming Language | JavaScript |
| API Automation | Playwright API testing |
| API Documentation / Manual API Work | Postman |
| Test Architecture | Page Object Model |
| Test Runner | Playwright Test |
| CI/CD | GitHub Actions |
| Source Control | Git / GitHub |

## Project Structure

```text
automation-exercise-playwright/
│
├── .github/
│   └── workflows/          CI/CD workflow
│
├── api/                    API configuration / helpers
├── api-tests/              Postman API collection / API artifacts
├── config/                 Test configuration / supporting configuration
├── pages/                  Page Object Model classes
│
├── tests/
│   ├── api/                API automation specs
│   ├── utils/              Shared test utilities / data helpers
│   ├── login.spec.js       Login & signup scenarios
│   ├── cart.spec.js        Cart scenarios
│   └── checkout.spec.js    Checkout scenarios
│
├── playwright.config.js    Playwright configuration
├── package.json            Project dependencies and scripts
├── README.md               Project documentation
└── storageState.json       Authenticated browser state
```

## Test Documentation

The project is supported by separate QA documentation covering planning, manual execution, defects, and test results.

### Test Plan

[View Test Plan](https://docs.google.com/document/d/1TurtuoFSXjmA95otdRhSaLQDjXxTNbr6mjD70V_bbGQ/edit?usp=sharing)

### Manual Test Case Log

[View Manual Test Case Log](https://docs.google.com/document/d/1lvmT0Q68B_rJPLB0VB7HmDYBQp1iXm-utrJX7t7-r08/edit?usp=sharing)

### Summary Test Execution Report

[View Summary Test Execution Report](https://docs.google.com/document/d/1yuMTnTLcn_3sfraXnLYCy2DI5YFb7CzvF4YGowjOHMY/edit?usp=sharing)

## Quality & Defect Assessment

Exploratory testing was performed using boundary-value analysis and state-transition heuristics.

The documented quality assessment identified **no P0 (Critical) or P1 (High) defects blocking the core conversion funnels**. Minor UI styling inconsistencies were observed and classified as lower-priority issues within the documented release assessment.

See the **Summary Test Execution Report** and **Manual Test Case Log** above for the detailed QA evidence.

## Running the Tests

Install dependencies:

```bash
npm install
```

Run the complete Playwright test suite:

```bash
npx playwright test
```

Run with a single worker and no retries:

```bash
npx playwright test --workers=1 --retries=0
```

Run a specific test file:

```bash
npx playwright test tests/checkout.spec.js
```

Run the HTML report:

```bash
npx playwright show-report
```

For debugging a specific test, Playwright traces, screenshots, and videos can be inspected from the generated test results when enabled by the project configuration.

## CI/CD

The project includes a GitHub Actions workflow for automated Playwright test execution.

[View GitHub Actions](https://github.com/Open83/automationexercise/actions)

## Key QA Skills Demonstrated

- Test planning and test-case design
- Functional and regression testing
- Exploratory testing
- Boundary Value Analysis
- State Transition Testing
- Positive and negative testing
- UI automation with Playwright
- API automation
- Page Object Model
- Reusable test fixtures and utilities
- Authentication state management
- Test reporting
- Screenshots, videos, and traces for failure investigation
- CI/CD with GitHub Actions
- Defect triage and quality assessment

## Portfolio

This project is part of my QA Automation portfolio and demonstrates how I approach test design, automation architecture, execution, reporting, and quality assessment from a real-world QA perspective.
