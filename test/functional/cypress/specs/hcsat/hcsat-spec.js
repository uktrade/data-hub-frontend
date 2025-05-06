import { companyGlobalUltimateAllDetails } from '../../fakers/companies'

const urls = require('../../../../../src/lib/urls')

describe('HCSAT', () => {
  context('displays on page with DefaultLayoutBase', () => {
    beforeEach(() => {
      cy.visit(
        urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
      )
    })

    it('should show HCSAT fields', () => {
      cy.get('[data-test="hcsat"]').contains('Is this page useful?')
    })
  })

  context('displays on page with DefaultLayout', () => {
    beforeEach(() => {
      cy.visit(urls.events.create())
    })

    it('should show HCSAT fields', () => {
      cy.get('[data-test="hcsat"]').contains('Is this page useful?')
    })
  })
})
