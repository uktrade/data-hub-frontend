const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const { testBreadcrumbs } = require('../../support/assertions')

const listSelectors = selectors.companyAddRemoveFromLists

describe('Adding and removing a company to a list', () => {
  context('when viewing the companies page with company lists created', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/activity`)
    })
    it('displays a button to add or remove from a list', () => {
      cy.contains('View Options').click()
      cy.contains('Add to or remove from lists')
    })
  })
  context('when viewing the add/remove from lists form', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
    })

    testBreadcrumbs({
      Home: '/',
      Companies: '/companies',
      'Lambda plc': '/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa',
      'Add and remove from lists': undefined,
    })

    it('should render options for list A', () => {
      cy.get(listSelectors.listA.legend).should(
        'have.text',
        'On the "List A" list'
      )
      cy.get(listSelectors.listA.radios).should('have.length', 2)
      cy.get(listSelectors.listA.labelYes).should('have.text', 'Yes')
      cy.get(listSelectors.listA.labelNo).should('have.text', 'No')
    })
    it('should render options for list B', () => {
      cy.get(listSelectors.listB.legend).should(
        'have.text',
        'On the "List B" list'
      )
      cy.get(listSelectors.listB.radios).should('have.length', 2)
      cy.get(listSelectors.listB.labelYes).should('have.text', 'Yes')
      cy.get(listSelectors.listB.labelNo).should('have.text', 'No')
    })
    it('should render options for list B', () => {
      cy.get(listSelectors.listC.legend).should(
        'have.text',
        'On the "List C" list'
      )
      cy.get(listSelectors.listC.radios).should('have.length', 2)
      cy.get(listSelectors.listC.labelYes).should('have.text', 'Yes')
      cy.get(listSelectors.listC.labelNo).should('have.text', 'No')
    })
    it('should render a "Create list" button', () => {
      cy.get(listSelectors.createButton).should(
        'have.text',
        'Create a new list'
      )
    })
    it('should render a "Save" button', () => {
      cy.get(listSelectors.saveButton).should('have.text', 'Save')
    })
    it('should render a "Cancel" link', () => {
      cy.get(listSelectors.cancelLink).should('have.text', 'Cancel')
    })
  })
})
