const fixtures = require('../../fixtures')
const { testBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

const listA = '70513f19-0df6-4c8d-bef1-f11b65641ae4'
const listB = '75e14e32-292e-4d1b-a361-992d548251f7'
const listC = 'a87af6bc-e117-47c7-ad3d-35f9900bbd0e'

const addRemoveFromListUrl = urls.companies.lists.addRemove(
  fixtures.company.lambdaPlc.id
)
const detailsUrl = urls.companies.detail(fixtures.company.lambdaPlc.id)

describe('Adding and removing a company to a list', () => {
  context('when viewing the companies page with company lists created', () => {
    beforeEach(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/activity`)
    })
    it('should display the add to list button', () => {
      cy.get('[data-test="add-to-list-button"]').contains('+ Add to list')
      cy.get('[data-test="add-to-list-button"]').click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(addRemoveFromListUrl)
        expect(loc.search).contains(detailsUrl)
      })
      cy.go('back')
    })
  })
  context('when viewing the add/remove from lists form', () => {
    beforeEach(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
    })

    testBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      'Lambda plc': `/companies/${fixtures.company.lambdaPlc.id}`,
      'Add and remove from lists': undefined,
    })
    it('should render a for with 3 checkboxes', () => {
      cy.get('[data-test="field-userCompanyLists"]')
        .children()
        .children()
        .children()
        .contains('What list do you want to save Lambda plc to?')
    })
    it('should render 3 checkboxes', () => {
      cy.get(`[data-test="checkbox-${listA}"]`)
        .next()
        .should('have.text', 'List A')
      cy.get(`[data-test="checkbox-${listB}"]`)
        .next()
        .should('have.text', 'List B')
      cy.get(`[data-test="checkbox-${listC}"]`)
        .next()
        .should('have.text', 'List C')
    })
    it('should render a "Create list" button', () => {
      cy.get('[data-test="create-list-button"]').should(
        'have.text',
        'Create a new list'
      )
    })
    it('should render a "Save" button', () => {
      cy.get('[data-test="submit-button"]').should('have.text', 'Save')
    })
    it('should render a "Cancel" link', () => {
      cy.get('[data-test="cancel-button"]').should('have.text', 'Cancel')
    })
  })

  context('when adding the company to a list', () => {
    beforeEach(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
      cy.get(`[data-test="checkbox-${listA}"]`).check()
      cy.get('[data-test="submit-button"]').click()
    })

    it('should redirect to the homepage', () => {
      cy.location('pathname').should('eq', `/`)
    })

    it('should show a flash message to say the lists have been updated', () => {
      cy.get('[data-test="flash"]').should(
        'contain.text',
        'Lists changes for this company have been saved.'
      )
    })
  })

  context('when removing the company from a list', () => {
    beforeEach(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
      cy.get(`[data-test="checkbox-${listB}"]`).check()
      cy.get('[data-test="submit-button"]').click()
    })

    it('should redirect to the homepage', () => {
      cy.location('pathname').should('eq', `/`)
    })

    it('should show a flash message to say the lists have been updated', () => {
      cy.get('[data-test="flash"]').should(
        'contain.text',
        'Lists changes for this company have been saved.'
      )
    })
  })
})
