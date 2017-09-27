const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Login = client.page.Login()

  Given(/^I am an authenticated user on the data hub website$/, async () => {
    await Login
      .navigate()
      .authenticate()
  })

  When(/^I am on the Datahub login page$/, async () => {
    await Login
      .navigate()
      .waitForElementVisible('@signInForm')
  })

  When(/^I enter my credentials$/, async () => {
    await Login
      .enterCredentials()
  })

  When(/^I submit the form$/, async () => {
    await Login
      .submitForm('@signInForm')
  })

  Then(/^I verify that I'm successfully logged in$/, async () => {
    await Login
      .waitForElementVisible('@searchBar')
  })

  Then(/^I logout of Datahub website$/, async () => {
    await Login
      .click('@signOutLink')
  })

  Then(/^I navigate to the support page$/, async () => {
    await Login
      .click('@supportLink')
      .assert.containsText('@pageHeading', 'Report a problem or leave feedback')
  })

  Then(/^I am not logged in$/, async () => {
    client
      .deleteCookies()
      .refresh()

    await Login
      .assert.elementPresent('@signInLink')
  })

  Then(/^I can navigate to the Datahub login page$/, async () => {
    await Login
      .click('@signInLink')
      .assert.containsText('@pageHeading', 'Sign in')
  })
})
