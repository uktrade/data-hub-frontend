const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { companies } = require('../../../../../src/lib/urls')

describe('Companies Contact', () => {
  context('when viewing contacts for an archived company', () => {
    before(() => {
      cy.visit(companies.contacts(fixtures.company.archivedLtd.id))
    })

    it('should not display the "Add contact" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .contact.addButton(fixtures.company.oneListCorp.id)
      ).should('not.exist')
    })

    it('should display the archived summary', () => {
      cy.get(selectors.companyCollection().archivedSummary).should(
        'contain',
        'Why can I not add a contact?'
      )
    })
  })
})
