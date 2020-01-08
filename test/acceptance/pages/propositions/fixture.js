const { find } = require('lodash')

const { proposition } = require('../../fixtures')

module.exports = {
  url: function propositionFixtureUrl(propositionName) {
    const fixture = find(proposition, { subject: propositionName })
    const propositionId = fixture
      ? fixture.id
      : proposition.gameChangingProposition.id

    return `${process.env.QA_HOST}/propositions/${propositionId}`
  },
  elements: {},
}
