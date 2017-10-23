const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')
const { set } = require('lodash')

const { getUid, appendUid } = require('../../../helpers/uuid')

const companySearchPage = `${process.env.QA_HOST}/search/companies` // TODO move these urls out into a url world object
const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ Given, When, Then }) => {
  const Company = client.page.Company()
  const Interaction = client.page.Interaction()
  const Contact = client.page.Contact()

  Given(/^a company is created for interactions$/, async function () {
    const companyName = appendUid(faker.company.companyName())

    await client
      .url(companySearchPage)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany({
        details: { name: companyName },
        callback: (company) => set(this.state, 'company', company),
      })
      .wait() // wait for backend to sync
  })

  Given(/^a company contact is created for interactions$/, async function () {
    const companyName = this.state.company.name

    await client
      .url(dashboardPage)

    await Company
      .navigate()
      .findCompany(getUid(companyName))
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .click('@contacts')

    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    await Contact
      .createNewPrimaryContact(firstName, lastName)
  })

  Given(/^a company investment project is created for interactions$/, async function () {
  })

  When(/^adding an interaction for the company/, async function () {
    const companyName = this.state.company.name

    await client
      .url(dashboardPage)

    await Company
      .findCompany(getUid(companyName))

    await Company.section.detailsTabs
      .click('@interactions')
      .wait()

    await Company
      .click('@addInteractionButton')
      .wait()

    await Interaction
      .createInteraction()
      .wait()
  })

  When(/^adding a service delivery for the company/, async function () {
  })

  When(/^adding an interaction for the contact/, async function () {
  })

  When(/^adding a service delivery for the contact/, async function () {
  })

  When(/^adding an interaction for the investment project/, async function () {
  })

  When(/^adding a service delivery for the investment project/, async function () {
  })

  When(/^navigating to the create company interaction step 1 page/, async function () {
    const companyName = this.state.company.name

    await client
      .url(dashboardPage)

    await Company
      .findCompany(getUid(companyName))
      .section.firstCompanySearchResult
      .click('@header')
      .wait()

    await Company.section.detailsTabs
      .click('@interactions')
      .wait()

    await Company
      .click('@addInteractionButton')
      .wait()
  })

  When(/^navigating to the create company service delivery step 1 page/, async function () {
    const companyName = this.state.company.name

    await client
      .url(dashboardPage)

    await Company
      .findCompany(getUid(companyName))
      .section.firstCompanySearchResult
      .click('@header')
      .wait()

    await Company.section.detailsTabs
      .click('@interactions')
      .wait()

    await Company
      .click('@addInteractionButton')
      .wait()
  })

  When(/^navigating to the create contact interaction step 1 page/, async function () {
  })

  When(/^navigating to the create contact service delivery step 1 page/, async function () {
  })

  When(/^navigating to the create investment project interaction step 1 page/, async function () {
  })

  When(/^navigating to the create investment project service delivery step 1 page/, async function () {
  })

  When(/^selecting interaction/, async function () {
    await Interaction
      .click('@aStandardInteraction')
      .click('@continueButton')
      .wait()
  })

  When(/^selecting service delivery/, async function () {
    await Interaction
      .click('@aServiceThatYouHaveProvided')
      .click('@continueButton')
      .wait()
  })

  When(/^the interaction events Yes option is chosen/, async function () {
    await Interaction
      .setValue('@eventYes', '')
      .click('@eventYes')
  })

  When(/^the interaction events No option is chosen/, async function () {
    await Interaction
      .setValue('@eventNo', '')
      .click('@eventNo')
  })

  Then(/^there are interaction fields$/, async function () {
    await Interaction
      .assert.visible('@contact')
      .assert.visible('@serviceProvider')
      .assert.visible('@service')
      .assert.visible('@subject')
      .assert.visible('@notes')
      .assert.visible('@dateOfInteractionYear')
      .assert.visible('@dateOfInteractionMonth')
      .assert.visible('@dateOfInteractionDay')
      .assert.visible('@ditAdviser')
      .assert.visible('@communicationChannel')
      .assert.elementNotPresent('@eventYes')
      .assert.elementNotPresent('@eventNo')
      .assert.elementNotPresent('@event')
      .wait()
  })

  Then(/^there are service delivery fields$/, async function () {
    await Interaction
      .assert.visible('@contact')
      .assert.visible('@serviceProvider')
      .assert.visible('@service')
      .assert.visible('@subject')
      .assert.visible('@notes')
      .assert.visible('@dateOfInteractionYear')
      .assert.visible('@dateOfInteractionMonth')
      .assert.visible('@dateOfInteractionDay')
      .assert.visible('@ditAdviser')
      .assert.elementNotPresent('@communicationChannel')
      .assert.visible('@eventYes')
      .assert.visible('@eventNo')
      .assert.elementPresent('@event')
  })

  Then(/^interaction fields are pre-populated$/, async function () {
    const assertIsSet = (result) => client.expect(result.value.length).to.be.greaterThan(0)
    // TODO test user does not have a DIT team
    // await Interaction.getValue('@serviceProvider', assertIsSet)
    await Interaction.getValue('@dateOfInteractionYear', assertIsSet)
    await Interaction.getValue('@dateOfInteractionMonth', assertIsSet)
    await Interaction.getValue('@dateOfInteractionDay', assertIsSet)
    await Interaction.getValue('@ditAdviser', assertIsSet)
  })

  Then(/^the interaction events is displayed$/, async function () {
    await Interaction
      .assert.visible('@event')
  })

  Then(/^the interaction events is not displayed$/, async function () {
    await Interaction
      .assert.hidden('@event')
  })
})
