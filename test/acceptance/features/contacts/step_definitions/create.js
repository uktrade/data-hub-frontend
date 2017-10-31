const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { set } = require('lodash')

const { getUid, appendUid } = require('../../../helpers/uuid')

const companySearchPage = `${process.env.QA_HOST}/search/companies` // TODO move these urls out into a url world object
const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const Search = client.page.Search()
  const Dashboard = client.page.Dashboard()

  Given(/^a company is created for contacts/, async function () {
    const companyName = appendUid(faker.company.companyName())

    await client
      .url(companySearchPage)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany(
        { name: companyName },
        (company) => set(this.state, 'company', company),
      )
      .wait() // wait for backend to sync
  })

  When(/^a primary contact is added$/, async function () {
    await Contact
      .createNewContact({}, true, (contact) => {
        this.state.contact = contact
      })
  })

  When(/^a primary contact with new company address is added$/, async function () {
    await Contact
      .createNewPrimaryContactWithNewCompanyAddress({}, (contact) => {
        this.state.contact = contact
      })
  })

  When(/^a non-primary contact is added$/, async function () {
    await Contact
      .createNewContact({}, false, (contact) => {
        this.state.contact = contact
      })
  })

  When(/^navigating to the company contacts$/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.company.name))

    await Company
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .waitForElementVisible('@contacts')
      .click('@contacts')

    await Company
      .waitForElementVisible('@addContactButton')
  })

  When(/^navigating to the create company contact page/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.company.name))

    await Company
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .waitForElementVisible('@contacts')
      .click('@contacts')

    await Company
      .waitForElementVisible('@addContactButton')
  })

  When(/^the add new contact button is clicked/, async function () {
    await Contact
      .click('@addContactButton')
  })

  When(/^the save button is clicked/, async function () {
    await Contact
      .click('@saveButton')
  })

  Then(/^there are contact fields$/, async function () {
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
      .assert.visible('@sameAddressYes')
      .assert.visible('@sameAddressNo')
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
