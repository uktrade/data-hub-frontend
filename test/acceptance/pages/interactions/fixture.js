const { find } = require('lodash')

const { interaction } = require('../../fixtures')

module.exports = {
  url: function interactionFixtureUrl(interactionName) {
    const fixture = find(interaction, { subject: interactionName })
    const interactionId = fixture
      ? fixture.id
      : interaction.attendedGammaEvent.id

    return `${process.env.QA_HOST}/interactions/${interactionId}`
  },
  elements: {},
}
