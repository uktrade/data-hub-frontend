const selectors = require('../../../../selectors')
const { testBreadcrumbs } = require('../../support/assertions')

describe('Delete company list page', () => {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

  context('when viewing "Delete company list"', () => {
    before(() => {
      cy.visit('/company-lists/2a8fb06f-2099-44d6-b404-e0fae0b9ea59/delete')
    })

    testBreadcrumbs({
      Home: '/',
      'Delete list': undefined,
    })

    it('displays the "Delete list" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Delete list')
    })

    it('displays the list name', () => {
      cy.get(selectors.companyList.delete.insetListItem.byIndex(1)).should(
        'have.text',
        'A list with multiple items'
      )
    })

    it('displays the number of companies on the list', () => {
      cy.get(selectors.companyList.delete.insetListItem.byIndex(2)).should(
        'have.text',
        '13 companies'
      )
    })

    it('displays the "Delete list" button', () => {
      cy.get(selectors.companyList.delete.deleteButton).should(
        'have.text',
        'Delete list'
      )
    })

    it('displays the "Return without deleting" link', () => {
      cy.get(selectors.companyList.delete.returnAnchor).should(
        'have.text',
        'Return without deleting'
      )
    })
  })

  context('after clicking the "Delete list" button', () => {
    before(() => {
      cy.visit('/company-lists/2a8fb06f-2099-44d6-b404-e0fae0b9ea59/delete')
      cy.get(selectors.companyList.delete.deleteButton).click()
    })

    it('redirects to the edit company lists page', () => {
      cy.location().should((loc) => {
        expect(loc.origin).to.eq(Cypress.config().baseUrl)
        expect(loc.pathname).to.eq('/')
      })
    })

    it('displays the "List deleted" flash message', () => {
      cy.get(selectors.localHeader().flash).should(
        'contain.text',
        'List deleted'
      )
    })
  })

  context('when there is an error deleting the list', () => {
    before(() => {
      cy.visit('/company-lists/0b89bb58-2769-4783-bb2f-7a22bb566473/delete')
      cy.get(selectors.companyList.delete.deleteButton).click()
    })

    it('displays the "List deleted" flash message', () => {
      cy.get(selectors.companyList.delete.errorHeader).should(
        'have.text',
        'There was an error deleting this list'
      )
    })
  })

  context("when the list doesn't exist", () => {
    before(() => {
      cy.visit('/company-lists/non-existent-list/delete', {
        failOnStatusCode: false,
      })
    })

    it('displays the 404 error page', () => {
      cy.get(selectors.localHeader().heading).should(
        'contain.text',
        'Page not found'
      )
    })
  })
})
