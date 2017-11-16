const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, set, camelCase } = require('lodash')

const { getUid } = require('../../../helpers/uuid')
const { getDateFor } = require('../../../helpers/date')

const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ Given, When, Then }) => {
  const Company = client.page.Company()
  const Interaction = client.page.Interaction()
  const Contact = client.page.Contact()
  const Search = client.page.Search()

  Given(/^a company contact is created for interactions$/, async function () {
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

    await Contact
      .createNewContact({}, true, (contact) => set(this.state, 'contact', contact))
      .wait() // wait for backend to sync
  })

  Given(/^a company investment project is created for interactions$/, async function () {
  })

  When(/^adding an interaction/, async function () {
    await Interaction
      .createInteraction({}, (interaction) => {
        set(this.state, 'interaction', interaction)
        set(this.state, 'interaction.date', getDateFor({
          year: get(this.state, 'interaction.dateOfInteractionYear'),
          month: get(this.state, 'interaction.dateOfInteractionMonth'),
          day: get(this.state, 'interaction.dateOfInteractionDay'),
        }))
        set(this.state, 'interaction.type', 'Interaction')
      })
      .wait() // wait for backend to sync
  })

  When(/^adding a service delivery/, async function () {
    await Interaction
      .createServiceDelivery({}, (serviceDelivery) => {
        set(this.state, 'serviceDelivery', serviceDelivery)
        set(this.state, 'serviceDelivery.date', getDateFor({
          year: get(this.state, 'serviceDelivery.dateOfInteractionYear'),
          month: get(this.state, 'serviceDelivery.dateOfInteractionMonth'),
          day: get(this.state, 'serviceDelivery.dateOfInteractionDay'),
        }))
        set(this.state, 'serviceDelivery.type', 'Service delivery')
      })
      .wait() // wait for backend to sync
  })

  When(/^navigating to the create company interactions and services step 1 page/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.company.name))

    await Company
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .waitForElementVisible('@interactions')
      .click('@interactions')

    await Company
      .waitForElementVisible('@addInteractionButton')
      .click('@addInteractionButton')
  })

  When(/^navigating to the create contact interactions and services step 1 page/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.contact.lastName))
      .section.tabs.click('@contacts')

    await Contact
      .section.firstContactSearchResult
      .click('@header')

    await Contact.section.detailsTabs
      .waitForElementVisible('@interactions')
      .click('@interactions')

    await Contact
      .waitForElementVisible('@addInteractionButton')
      .click('@addInteractionButton')
  })

  When(/^navigating to the create investment project interaction page/, async function () {
  })

  When(/^selecting interaction/, async function () {
    await Interaction
      .waitForElementVisible('@continueButton')
      .click('@aStandardInteraction')
      .click('@continueButton')
  })

  When(/^selecting service delivery/, async function () {
    await Interaction
      .waitForElementVisible('@continueButton')
      .click('@aServiceThatYouHaveProvided')
      .click('@continueButton')
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
      .waitForElementVisible('@contact')
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
  })

  Then(/^there are service delivery fields$/, async function () {
    await Interaction
      .waitForElementVisible('@contact')
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
