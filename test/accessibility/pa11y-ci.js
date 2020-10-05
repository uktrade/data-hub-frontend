const fixtures = require('../functional/cypress/fixtures')
const urls = require('../../src/lib/urls')

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const id = fixtures.company.oneListTierDita.id

// Ensure you create the directory <project-root>/reports/pa11y before running the tests
// as pa11y won't do it for us.

// https://github.com/pa11y/pa11y#command-line-interface
const config = {
  defaults: {
    standard: 'WCAG2AA', // default
    timeout: 10000,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    // Error: Failed to launch chrome!
    // Running as root without --no-sandbox is not supported
    // https://hub.docker.com/r/digitalist/pa11y-ci/
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
  },

  // The `urls` array of objects would be generated from a sitemap/urls.js file
  // https://github.com/uktrade/data-hub-frontend/blob/master/src/lib/urls.js
  // Example of a sitemap: https://www.aviva.com/sitemap.xml
  urls: [
    {
      // App root
      url: `${baseUrl}`,
      screenCapture: 'reports/pa11y/dashboard.png',
    },
    {
      // Companies collection list
      url: `${baseUrl}${urls.companies.index()}`,
      screenCapture: 'reports/pa11y/companies-list.png',
    },
    {
      // Company activity
      url: `${baseUrl}${urls.companies.activity.index(id)}`,
      screenCapture: 'reports/pa11y/company-activity.png',
    },
    {
      // Company contacts
      url: `${baseUrl}${urls.companies.contacts(id)}`,
      screenCapture: 'reports/pa11y/company-contacts.png',
    },
    {
      // Company lead adviser
      url: `${baseUrl}${urls.companies.advisers.index(id)}`,
      screenCapture: 'reports/pa11y/company-advisers.png',
    },
    {
      // Company investment projects
      url: `${baseUrl}${urls.companies.investments.companyInvestment(id)}`,
      screenCapture: 'reports/pa11y/company-investment.png',
    },
    {
      // Company large capital profile
      url: `${baseUrl}${urls.companies.investments.largeCapitalProfile(id)}`,
      screenCapture: 'reports/pa11y/company-large-capital-profile.png',
    },
    {
      // Company orders
      url: `${baseUrl}${urls.companies.orders(id)}`,
      screenCapture: 'reports/pa11y/company-orders.png',
    },
    {
      url: `${baseUrl}${urls.investments.projects.editDetails(id)}`,
      screenCapture: 'reports/pa11y/company-assign-adviser.png',
      // Actions are additional interactions that you can make
      // Pa11y perform before the tests are run
      actions: [
        // Here we're going to change the underlying HTML/DOM by
        // adding another `business activity` then run the tests.
        'click element button[name=add-item]',
      ],
    },
  ],
}

module.exports = config
