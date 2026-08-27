# Automation Exercise – Playwright Test Suite

Automated regression suite for automationexercise.com, a public practice e-commerce site. Built as a QA portfolio project to demonstrate structured test planning, exploratory testing, API testing, and UI test automation.

[![Playwright Tests](https://github.com/Open83/automationexercise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Open83/automationexercise/actions/workflows/playwright.yml)


## What this covers
* **Login & Signup:** New user registration, duplicate email handling, invalid login, empty-field submission.
* **Cart:** Adding single/multiple products, removing products, guest checkout redirect.
* **Checkout:** Full order placement, order review accuracy.
* **API Testing:** Core endpoint validation using Postman (login, search, account creation).

10 automated UI test cases across 3 spec files, built using the Page Object Model for maintainability, executed across **Chromium and Firefox**.

## Related project artifacts
* 📄 **Test Plan:** [View Google Doc](https://docs.google.com/document/d/1TurtuoFSXjmA95otdRhSaLQDjXxTNbr6mjD70V_bbGQ/edit?usp=sharing)
* 🐞 Defect Triage & Quality Gate: Zero P0 (Critical) or P1 (High) defects blocking core conversion funnels were identified. Exploratory testing using boundary value analysis and state transition heuristics confirmed robust backend validation. Minor UI styling inconsistencies (P3/P4) were observed but fall within acceptable release tolerances, satisfying all primary Acceptance Criteria.
* 🧪 **Manual Test Case Log:** [View Google Doc] (https://docs.google.com/document/d/1lvmT0Q68B_rJPLB0VB7HmDYBQp1iXm-utrJX7t7-r08/edit?usp=sharing)
* 📊 **Summary Test Execution Report:** [View Google Doc] (https://docs.google.com/document/d/1yuMTnTLcn_3sfraXnLYCy2DI5YFb7CzvF4YGowjOHMY/edit?usp=sharing)

## Tech stack
* **UI Automation:** Playwright (JavaScript)
* **API Testing:** Postman
* **CI/CD:** GitHub Actions

## Project structure
```text
├── api-tests/           Postman API test collection
├── pages/               Page Object Model classes (one per page/flow)
├── tests/               Test specs
│   ├── utils/           Shared test data helpers
│   ├── login.spec.js
│   ├── cart.spec.js
│   └── checkout.spec.js
├── playwright.config.js
└── .github/workflows/   CI pipeline