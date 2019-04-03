const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get, set, camelCase, fromPairs, map, capitalize } = require('lodash')

const { getDateFor } = require('../../../helpers/date')

const Interaction = client.page.interactions.interaction()
const InteractionList = client.page.interactions.list()

When(/^a service delivery policy feedback is added$/, async function (dataTable) {
  const details = fromPairs(map(dataTable.hashes(), hash => [camelCase(hash.key), hash.value]))
  await Interaction
    .createInteractionPolicyFeedback(details, true, (interaction) => {
      set(this.state, 'interaction', interaction)
      set(this.state, 'interaction.date', getDateFor({
        year: get(this.state, 'interaction.dateOfInteractionYear'),
        month: get(this.state, 'interaction.dateOfInteractionMonth'),
        day: get(this.state, 'interaction.dateOfInteractionDay'),
      }))
      set(this.state, 'interaction.policyIssueType1', 'Domestic')
      set(this.state, 'interaction.policyArea', interaction.policyArea)
      set(this.state, 'interaction.policyFeedbackNotes', interaction.policyFeedbackNotes)
      set(this.state, 'interaction.type', 'interaction')
    })
    .wait() // wait for backend to sync
})

When(/^an interaction policy feedback is added$/, async function (dataTable) {
  const details = fromPairs(map(dataTable.hashes(), hash => [camelCase(hash.key), hash.value]))
  await Interaction
    .createInteractionPolicyFeedback(details, false, (interaction) => {
      set(this.state, 'interaction', interaction)
      set(this.state, 'interaction.date', getDateFor({
        year: get(this.state, 'interaction.dateOfInteractionYear'),
        month: get(this.state, 'interaction.dateOfInteractionMonth'),
        day: get(this.state, 'interaction.dateOfInteractionDay'),
      }))
      set(this.state, 'interaction.policyIssueType1', 'Domestic')
      set(this.state, 'interaction.policyArea', interaction.policyArea)
      set(this.state, 'interaction.policyFeedbackNotes', interaction.policyFeedbackNotes)
      set(this.state, 'interaction.type', 'interaction')
    })
    .wait() // wait for backend to sync
})

When(/^[an]{1,2} (interaction|service delivery) is added$/, async function (kind, dataTable) {
  const details = fromPairs(map(dataTable.hashes(), hash => [camelCase(hash.key), hash.value]))
  await Interaction
    .createInteraction(details, kind === 'service delivery', (interaction) => {
      set(this.state, 'interaction', interaction)
      set(this.state, 'interaction.date', getDateFor({
        year: get(this.state, 'interaction.dateOfInteractionYear'),
        month: get(this.state, 'interaction.dateOfInteractionMonth'),
        day: get(this.state, 'interaction.dateOfInteractionDay'),
      }))
      set(this.state, 'interaction.type', capitalize(kind))
    })
    .wait() // wait for backend to sync
})

When(/^I select interaction$/, async function () {
  await Interaction
    .waitForElementVisible('@continueButton')
    .click('@aStandardInteraction')
    .click('@continueButton')
})

When(/^I select a policy feedback option$/, async function () {
  await Interaction
    .waitForElementVisible('@policyFeedbackYes')
    .click('@policyFeedbackYes')
})

When(/^I select service delivery$/, async function () {
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
    .assert.visible('@ditAdviser')
    .assert.elementNotPresent('@eventYes')
    .assert.elementNotPresent('@eventNo')
    .assert.elementNotPresent('@event')
    .assert.visible('@service')
    .assert.elementNotPresent('@serviceStatus')
    .assert.elementNotPresent('@grantOffered')
    .assert.elementNotPresent('@netReceipt')
    .assert.visible('@subject')
    .assert.visible('@notes')
    .assert.visible('@dateOfInteractionYear')
    .assert.visible('@dateOfInteractionMonth')
    .assert.visible('@dateOfInteractionDay')
    .assert.visible('@communicationChannel')
})

Then(/^there are service delivery fields$/, async function () {
  await Interaction
    .waitForElementVisible('@contact')
    .assert.visible('@contact')
    .assert.visible('@ditAdviser')
    .assert.visible('@eventYes')
    .assert.visible('@eventNo')
    .assert.elementPresent('@event')
    .assert.visible('@service')
    .assert.hidden('@serviceStatus')
    .assert.hidden('@grantOffered')
    .assert.hidden('@netReceipt')
    .assert.visible('@subject')
    .assert.visible('@notes')
    .assert.visible('@dateOfInteractionYear')
    .assert.visible('@dateOfInteractionMonth')
    .assert.visible('@dateOfInteractionDay')
})

Then(/^there are interaction policy feedback fields$/, async function () {
  await Interaction
    .waitForElementVisible('@policyIssueType1')
    .assert.visible('@policyIssueType1')
    .assert.visible('@policyIssueType2')
    .assert.visible('@policyIssueType3')
    .assert.visible('@policyIssueType4')
    .assert.visible('@policyIssueType5')
    .assert.visible('@policyArea')
    .assert.visible('@policyFeedbackNotes')
})

Then(/^(interaction|policy feedback) fields are pre-populated$/, async function (kind) {
  const assertIsSet = (result) => client.expect(result.value.length).to.be.greaterThan(0)

  await Interaction.getValue('@dateOfInteractionYear', assertIsSet)
  await Interaction.getValue('@dateOfInteractionMonth', assertIsSet)
  await Interaction.getValue('@dateOfInteractionDay', assertIsSet)

  await client.expect(Interaction.getText('@ditAdviser')).not.to.be.empty
})

Then(/^the interaction events is displayed$/, async function () {
  await Interaction
    .assert.visible('@event')
})

Then(/^the interaction events is not displayed$/, async function () {
  await Interaction
    .assert.hidden('@event')
})

Then(/^the service fields are visible$/, async function () {
  await Interaction
    .waitForElementVisible('@serviceStatus')
    .assert.visible('@serviceStatus')
    .assert.visible('@grantOffered')
})

Then(/^the service fields are hidden/, async function () {
  await Interaction
    .waitForElementPresent('@serviceStatus')
    .assert.hidden('@serviceStatus')
    .assert.hidden('@grantOffered')
})

Then(/^the net receipt field is visible$/, async function () {
  await Interaction
    .waitForElementVisible('@netReceipt')
    .assert.visible('@netReceipt')
})

Then(/^the net receipt field is hidden/, async function () {
  await Interaction
    .waitForElementPresent('@netReceipt')
    .assert.hidden('@netReceipt')
})

/**
 * The filtering available for Interactions or Service Delivery is particularly hard to pin down a specific
 * Interaction or Service Delivery - this is by design. The filtering here combined with random dates for creation
 * of an Interaction or Service Delivery should mean we always find what we are looking for in the first
 * result of the Collection.
 */
Then(/^I filter the collections to view the (.+) I have just created$/, async function (typeOfInteraction) {
  const filtersSection = InteractionList.section.filters
  const filterTagsSection = InteractionList.section.filterTags
  const waitForTimeout = 15000
  const interactionType = camelCase(typeOfInteraction)

  const inputDateFormat = process.env.NW_CIRCLECI ? 'MM/DD/YYYY' : 'DD/MM/YYYY'

  const date = getDateFor({
    year: get(this.state, 'interaction.dateOfInteractionYear'),
    month: get(this.state, 'interaction.dateOfInteractionMonth'),
    day: get(this.state, 'interaction.dateOfInteractionDay'),
  }, inputDateFormat)

  const expectedDate = getDateFor({
    year: get(this.state, 'interaction.dateOfInteractionYear'),
    month: get(this.state, 'interaction.dateOfInteractionMonth'),
    day: get(this.state, 'interaction.dateOfInteractionDay'),
  }, 'YYYY-MM-DD')

  await filtersSection
    .waitForElementPresent(`@${interactionType}`)
    .click(`@${interactionType}`)

  await filterTagsSection
    .waitForElementPresent('@kind', waitForTimeout)

  client.clearValue('#field-date_after')

  await filtersSection
    .sendKeys('@dateFrom', date)

  client.expect.element('#field-date_after').to.have.value.which.contains(`${expectedDate}`)

  client.clearValue('#field-date_before')

  await filtersSection
    .sendKeys('@dateTo', date)

  client.expect.element('#field-date_before').to.have.value.which.contains(`${expectedDate}`)

  await filtersSection
    .sendKeys('@dateTo', [ client.Keys.ENTER ])

  await filterTagsSection
    .waitForElementPresent('@dateTo', waitForTimeout)
})
