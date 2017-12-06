const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, set, camelCase } = require('lodash')

const { getDateFor } = require('../../../helpers/date')

defineSupportCode(({ Given, When, Then }) => {
  const Interaction = client.page.Interaction()

  Given(/^a company investment project is created for interactions$/, async function () {
  })

  When(/^an interaction is added$/, async function () {
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

  When(/^a service delivery is added$/, async function () {
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

  When(/^selecting interaction$/, async function () {
    await Interaction
      .waitForElementVisible('@continueButton')
      .click('@aStandardInteraction')
      .click('@continueButton')
  })

  When(/^selecting service delivery$/, async function () {
    await Interaction
      .waitForElementVisible('@continueButton')
      .click('@aServiceThatYouHaveProvided')
      .click('@continueButton')
  })

  When(/^the interaction events Yes option is chosen$/, async function () {
    await Interaction
      .setValue('@eventYes', '')
      .click('@eventYes')
  })

  When(/^the interaction events No option is chosen$/, async function () {
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

  /**
   * The filtering available for Interactions and Service Delivery is particularly hard to pin down a specific
   * Interaction or Service Delivery. This is by design. The filtering here combined with random dates for creation
   * of an Interaction or Service Delivery should mean we always find what we are looking for in the first
   * result of the Collection.
   */
  Then(/^I filter the collections to view the (.+) I have just created$/, async function (typeOfInteraction) {
    const filtersSection = Interaction.section.filters
    const interactionType = camelCase(typeOfInteraction)
    const date = getDateFor({
      year: get(this.state, `${interactionType}.dateOfInteractionYear`),
      month: get(this.state, `${interactionType}.dateOfInteractionMonth`),
      day: get(this.state, `${interactionType}.dateOfInteractionDay`),
    }, 'YYYY-M-D')

    await filtersSection
      .waitForElementPresent(`@${interactionType}`)
      .click(`@${interactionType}`)
      .wait() // wait for xhr
      .clickListOption('dit_adviser', get(this.state, `${interactionType}.ditAdviser`))
      .wait() // wait for xhr
      .setValue('@dateFrom', date)
      .sendKeys('@dateFrom', [ client.Keys.ENTER ])
      .wait() // wait for xhr
      .setValue('@dateTo', date)
      .sendKeys('@dateTo', [ client.Keys.ENTER ])
      .wait() // wait for xhr

    if (interactionType === 'interaction') {
      await filtersSection
        .clickListOption('communication_channel', get(this.state, 'interaction.communicationChannel'))
        .wait() // wait for xhr
    }
  })
})
