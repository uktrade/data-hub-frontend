const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Login = client.page.Login()

  Given(/^I am on the Data Hub login page$/, async () => {
    await Login
      .navigate()
      .waitForElementVisible('body', 1000)
  })

  When(/^I enter my credentials$/, async () => {
    await Login
      .enterCredentials()
  })

  When(/^I submit the form$/, async () => {
    await Login
      .submitForm('@form')
  })

  Then(/^I verify that I’m successfully logged in$/, async () => {
    await Login
      .waitForElementVisible('@searchBar', 1000)
  })

  When(/^I click on “Sign out” button$/, async () => {
    await Login
      .click('@signOutButton')
  })

  Then(/^I have been logged out$/, async () => {
    await Login
      .verify.containsText('@flashMessage', 'You have been successfully signed out.')
  })
})
