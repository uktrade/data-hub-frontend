const urls = require('../../../../../src/lib/urls')

describe('Dashboard search', () => {
  context('Search form attributes and text', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
    })

    after(() => {
      cy.resetUser()
    })

    beforeEach(() => {
      cy.get('[data-test="search-data-hub"] form').as('form')
    })

    it('should contain a blue background for the search bar', () => {
      cy.get('[data-test="search-data-hub"]').should(
        'have.css',
        'background-color',
        'rgb(29, 112, 184)'
      )
    })

    it('should contain a form', () => {
      cy.get('@form')
        .should('have.attr', 'method', 'GET')
        .should('have.attr', 'action')
    })

    it('should contain a div wrapper defining the role as search', () => {
      cy.get('@form').find('div').should('have.attr', 'role', 'search')
    })

    it('should contain a hidden label for accessibility', () => {
      cy.get('@form')
        .find('label')
        .should('have.attr', 'for', 'search-input')
        .should('have.text', 'Input your search term')
    })

    it('should contain an input element', () => {
      cy.get('@form')
        .find('input')
        .should('have.attr', 'type', 'text')
        .should('have.attr', 'name', 'term')
        .should('have.attr', 'id', 'search-input')
        .should('have.attr', 'placeholder', 'Search Data Hub')
    })

    it('should contain a button', () => {
      cy.get('@form').find('button').should('have.attr', 'type', 'submit')
    })

    it('should contain an SVG icon', () => {
      cy.get('@form')
        .find('svg')
        .should('have.attr', 'viewBox', '0 0 18 18')
        .should('have.attr', 'focusable', 'false')
        .should('have.attr', 'aria-hidden', 'true')
    })

    it('should contain hidden button text for accessibility', () => {
      cy.get('@form')
        .find('button span')
        .should('have.attr', 'focusable', 'false')
        .should('have.text', 'Submit Search')
    })
  })

  context('Searching for something on Data Hub', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
    })

    after(() => {
      cy.resetUser()
    })

    beforeEach(() => {
      cy.get('[data-test="search-data-hub"] form').as('form')
    })

    it('Enter a search term and enter', () => {
      cy.get('@form')
        .find('input')
        .type('foobarbaz{enter}')
        .location('pathname')
        .should('eq', urls.search.type('companies'))
    })
  })
})
