const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors/index.js')

describe('Companies business details', () => {
  context('when viewing subsidiaries for a Dun & Bradstreet company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/subsidiaries`)
    })

    it('should display the "Why can I not link a subsidiary?" D&B details summary', () => {
      cy.get(selectors.companySubsidiaries().whyDunAndBradstreet).should('be.visible')
    })

    it('should not display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('not.exist')
    })
  })

  context('when viewing subsidiaries for a Data Hub company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.venusLtd.id}/subsidiaries`)
    })

    it('should not display the "Why can I not link a subsidiary?" D&B details summary', () => {
      cy.get(selectors.companySubsidiaries().whyDunAndBradstreet).should('not.exist')
    })

    it('should not display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('not.exist')
    })
  })

  context('when viewing subsidiaries for an archived company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/subsidiaries`)
    })

    it('should not display the "Why can I not link a subsidiary?" D&B details summary', () => {
      cy.get(selectors.companySubsidiaries().whyDunAndBradstreet).should('not.exist')
    })

    it('should display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('be.visible')
    })
  })
})
