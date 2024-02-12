const selectors = require('../../../../selectors')
const multipleList = require('../../fixtures/company-lists/multiple-items.json')
const listWithError = require('../../fixtures/company-lists/list-with-error.json')
const nonExistentList = require('../../fixtures/company-lists/non-existent-list.json')
const { testBreadcrumbs } = require('../../support/assertions')

describe('Edit company list page', () => {
  context('when viewing "Edit company list"', () => {
    beforeEach(() => {
      cy.visit(`/company-lists/${multipleList.id}/rename`)
    })

    testBreadcrumbs({
      Home: '/',
      'Edit list': undefined,
    })

    it('displays the "Edit list" heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'Edit list name'
      )
    })
    it('displays a label', () => {
      cy.get(selectors.companyList.edit.form.label).should(
        'have.text',
        'List name'
      )
    })
    it('displays hint text', () => {
      cy.get('[data-test="hint-text"]').should(
        'have.text',
        'This is a name only you see, and can be up to 30 characters'
      )
    })
    it('displays a prepopulated input field with a list name', () => {
      cy.get(selectors.companyList.edit.form.input).should(
        'have.value',
        'A list with multiple items'
      )
    })
    it('displays a save button', () => {
      cy.get(selectors.companyList.edit.saveButton).should('have.text', 'Save')
    })
    it('displays a cancel link', () => {
      cy.get('[data-test=cancel-button]')
        .should('have.text', 'Cancel')
        .should('have.attr', 'href', '/')
    })
  })

  context('After editing the list and clicking the "Save" button', () => {
    beforeEach(() => {
      cy.visit(`/company-lists/${multipleList.id}/rename`)
      cy.get(selectors.companyList.edit.form.input)
        .clear()
        .type('New list name')
      cy.get(selectors.companyList.edit.saveButton).click()
    })

    it('redirects to the home page', () => {
      cy.location().should((loc) => {
        expect(loc.origin).to.eq(Cypress.config().baseUrl)
        expect(loc.pathname).to.eq('/')
      })
    })

    it('displays the "List updated" flash message', () => {
      cy.get('[data-test="flash"]').should('contain.text', 'List updated')
    })
  })

  context('when there is an error editing the list', () => {
    before(() => {
      cy.visit(`/company-lists/${listWithError.id}/rename`)
      cy.get(selectors.companyList.edit.form.input)
        .clear()
        .type('New list name')
      cy.get(selectors.companyList.edit.saveButton).click()
    })

    it('displays the "List edited" error flash message', () => {
      cy.get(selectors.companyList.edit.errorHeader).should(
        'have.text',
        'Could not load Edit company list'
      )
    })
  })

  context("when the list you are trying to edit doesn't exist", () => {
    before(() => {
      cy.visit(`/company-lists/${nonExistentList.id}/rename`, {
        failOnStatusCode: false,
      })
    })

    it('displays the 404 page', () => {
      cy.get(selectors.localHeader().heading).should(
        'contain.text',
        'Page not found'
      )
    })
  })
})
