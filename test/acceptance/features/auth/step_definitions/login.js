const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Login = client.page.Login()

  // Given

  Given(/^I am an authenticated user on the data hub website$/, async () => {
    await Login
      .navigate()
      .authenticate()
  })

  Given(/^I am not logged in$/, async () => {
    client
      .deleteCookies()
      .refresh()

    await Login
      .assert.elementPresent('@signInLink')
  })

  // When

  When(/^I am on the Data Hub login page$/, async () => {
    await Login
      .navigate()
      .waitForElementVisible('@signInForm')
  })

  When(/^I enter correct credentials$/, async () => {
    await Login
      .enterCredentials()
  })

  When(/^I enter incorrect credentials$/, async () => {
    await Login
      .setValue('@usernameField', 'not@user')
      .setValue('@passwordField', 'nah')
  })

  // Then

  Then(/^I should be successfully logged in$/, async () => {
    await Login
      .waitForElementVisible('@searchBar')
  })

  Then(/^I log out of Data Hub website$/, async () => {
    await Login
      .click('@signOutLink')
  })

  Then(/^I navigate to the support page$/, async () => {
    await Login
      .click('@supportLink')
      .assert.containsText('@pageHeading', 'Report a problem or leave feedback')
  })

  Then(/^I can navigate to the Data Hub login page$/, async () => {
    await Login
      .click('@signInLink')
      .assert.containsText('@pageHeading', 'Sign in')
  })
})
