const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Companies Contact', () => {
  context('when viewing contacts for an archived company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/contacts`)
    })

    it('should not display the "Add contact" button', () => {
      cy.get(selectors.companyCollection().contact.addButton(fixtures.company.oneListCorp.id)).should('not.exist')
    })

    it('should display the archived summary', () => {
      cy.get(selectors.companyCollection().archivedSummary).should('contain', 'Why can I not add a contact?')
    })
  })
})
