# Automation Exercise – Playwright Test Suite

![Playwright Tests](https://github.com/YOUR_GITHUB_USERNAME/automation-exercise-playwright/actions/workflows/playwright.yml/badge.svg)

Automated regression suite for [automationexercise.com](https://automationexercise.com), a public practice e-commerce site. Built as a QA portfolio project to demonstrate structured test planning, exploratory testing, and test automation.

> Replace `YOUR_GITHUB_USERNAME` above with your actual GitHub username once this repo is pushed, so the badge shows your real CI status.

## What this covers

- **Login & Signup** – new user registration, duplicate email handling, invalid login, empty-field submission
- **Cart** – adding single/multiple products, removing products, guest checkout redirect
- **Checkout** – full order placement, order review accuracy

10 automated test cases across 3 spec files, built using the Page Object Model for maintainability.

## Related project artifacts

- 📄 Test Plan: [link to your Google Doc, once shared as "anyone with link can view"]
- 🐞 Bug Reports: [link to your bug report doc/page, e.g. from Sauce Demo exploratory testing]

## Tech stack

- [Playwright](https://playwright.dev/) (JavaScript)
- GitHub Actions for CI

## Project structure

```
├── pages/              Page Object Model classes (one per page/flow)
├── tests/               Test specs
│   ├── utils/           Shared test data helpers
│   ├── login.spec.js
│   ├── cart.spec.js
│   └── checkout.spec.js
├── playwright.config.js
└── .github/workflows/   CI pipeline
```

## Setup

1. Install [Node.js](https://nodejs.org/) (LTS version).
2. Clone this repo and install dependencies:
   ```
   npm install
   npx playwright install
   ```

## One-time test data setup

Two tests (`should show an error when signing up with an already registered email` and all of `checkout.spec.js`) need **one fixed account that already exists** on the site, because they test login and duplicate-signup behavior.

1. Manually create one account on [automationexercise.com](https://automationexercise.com) and keep it permanently (don't delete it).
2. Create a `.env` file in the project root (this file is gitignored, so it stays private):
   ```
   EXISTING_TEST_EMAIL=your_fixed_test_email@mailinator.com
   EXISTING_TEST_PASSWORD=your_fixed_test_password
   ```
3. For CI, add the same two values as **Repository Secrets** in GitHub (`Settings → Secrets and variables → Actions`) using the same names, so the workflow can use them too.

## Running the tests

```
npx playwright test              # run all tests headless
npx playwright test --headed     # run with the browser visible
npx playwright test --ui         # interactive UI mode (great for debugging)
npx playwright show-report       # view the last HTML report
```

## Note on selectors

Selectors are based on the site's publicly documented `data-qa` attributes and stable HTML structure. If a selector doesn't match (the site can change over time), run:

```
npx playwright codegen automationexercise.com
```

This opens a browser where your clicks generate the correct selector automatically — copy it into the relevant page object.

## Why this project exists

This suite pairs with a written test plan and manual exploratory testing to demonstrate a full QA workflow: planning → manual/exploratory testing → bug reporting → automated regression coverage.
