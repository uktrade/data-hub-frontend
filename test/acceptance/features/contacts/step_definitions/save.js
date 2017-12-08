const { set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const Dashboard = client.page.Dashboard()

  When(/^a primary contact is added$/, async function () {
    await Contact
      .createNewContact({}, true, (contact) => {
        set(this.state, 'contact', contact)
        set(this.state, 'contact.type', 'Primary')
      })
  })

  When(/^a primary contact with new company address is added$/, async function () {
    await Contact
      .createNewPrimaryContactWithNewCompanyAddress({}, (contact) => {
        set(this.state, 'contact', contact)
      })
  })

  When(/^a non-primary contact is added$/, async function () {
    await Contact
      .createNewContact({}, false, (contact) => {
        set(this.state, 'contact', contact)
      })
  })

  When(/^the contact is clicked/, async function () {
    await Company
      .section.firstContactsTabContact
      .click('@header')
  })

  Then(/^there are contact fields$/, async function () { // TODO this can be DRY'd up to use a generic datatable to assert what the form contains
    await Contact
      .waitForElementVisible('@firstName')
      .assert.visible('@firstName')
      .assert.visible('@lastName')
      .assert.visible('@jobTitle')
      .assert.visible('@primaryContactYes')
      .assert.visible('@primaryContactNo')
      .assert.visible('@telephoneCountryCode')
      .assert.visible('@telephoneNumber')
      .assert.visible('@emailAddress')
      .assert.visible('@acceptsEmailMarketingFromDit')
      .assert.visible('@sameAddressAsCompanyYes')
      .assert.visible('@sameAddressAsCompanyNo')
      .assert.visible('@alternativePhoneNumber')
      .assert.visible('@alternativeEmail')
      .assert.visible('@notes')
  })

  Then(/^the contact fields have error messages$/, async function () {
    await Contact
      .assert.visible('@firstNameError')
      .assert.visible('@lastNameError')
      .assert.visible('@primaryContactError')
      .assert.visible('@telephoneCountryCodeError')
      .assert.visible('@telephoneNumber')
      .assert.visible('@emailAddressError')
  })

  Then(/^the contact is displayed on the company contact tab$/, async function () {
    const contactName = `${this.state.contact.firstName} ${this.state.contact.lastName}`

    await Company
      .section.firstContactsTabContact
      .assert.visible('@header')
      .assert.containsText('@header', contactName)
  })

  Then(/^the contact is displayed on the dashboard$/, async function () {
    const contactName = `${this.state.contact.firstName} ${this.state.contact.lastName}`
    const dashboardContactEntry = `${contactName} from ${this.state.company.name}`

    await Dashboard
      .assert.containsText('@firstMyLatestContact', dashboardContactEntry)
  })
})
