const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')

describe('Company Global Ultimate HQ', () => {
  context('when a company has a DnB Ultimate HQ badge', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.dnbGlobalUltimate.id}/activity`)
    })

    it('should not display a "Ultimate HQ" badge when the feature flag "companies-ultimate-hq" is false', () => {
      cy.get(selectors.localHeader().badge(1)).should('not.be.visible')
    })
  })
})
