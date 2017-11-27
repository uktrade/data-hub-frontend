const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

defineSupportCode(({ Given, Then, When }) => {
  const Interaction = client.page.Interaction()

  When(/^browsing to interaction fixture (.+)$/, async function (interactionSubject) {
    const interactions = map(this.fixtures.interaction, (interaction) => { return interaction })
    const interaction = find(interactions, { subject: interactionSubject })
    const url = this.urls.interactionsAndServices.getDetails(interaction.pk)

    set(this.state, 'interaction', interaction)

    await client
      .url(url)
  })

  Then(/^the interaction details Documents link is displayed$/, async function () {
    await Interaction
      .section.details
      .assert.visible('@documentsLink')
  })

  Then(/^the interaction details Documents link is not displayed$/, async function () {
    await Interaction
      .section.details
      .assert.elementNotPresent('@documentsLink')
  })
})
