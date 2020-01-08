const { find } = require('lodash')

const { company: companyFixtures } = require('../../../fixtures')

module.exports = {
  url: function companyFixtureUrl(companyName) {
    const fixture = find(companyFixtures, { name: companyName })
    const urlSuffix = fixture ? `?company=${fixture.id}&skip-company=true` : ''

    return `${process.env.QA_HOST}/omis/create${urlSuffix}`
  },
  elements: {},
}
