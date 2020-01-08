const { find } = require('lodash')

const { company } = require('../../fixtures')

module.exports = {
  url: function companyFixtureUrl(companyName) {
    const fixture = find(company, { name: companyName })
    const companyId = fixture ? fixture.id : company.ukLtd.id

    return `${process.env.QA_HOST}/companies/${companyId}/orders`
  },
  elements: {},
}
