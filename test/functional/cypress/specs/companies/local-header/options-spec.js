const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

describe('Local header options', () => {
  context('when the view options button is clicked', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.dnbCorp.id))
      cy.get('[data-test=local-header-options-dropdown] > div > button').click()
      cy.get('#dropDownOptionsMenu > a').as('links')
    })

    it('should display the add to list link', () => {
      cy.get('@links')
        .first()
        .should('have.text', 'Add to or remove from lists')
        .should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.dnbCorp.id
          )}?returnUrl=${urls.companies.detail(fixtures.company.dnbCorp.id)}`
        )
    })

    it('should display the add to export list link', () => {
      cy.get('@links')
        .last()
        .should('have.text', 'Add to export list')
        .should(
          'have.attr',
          'href',
          urls.exportPipeline.create(fixtures.company.dnbCorp.id)
        )
    })
  })
})
