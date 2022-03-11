const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')

describe('Investment Opportunity Collections Sort', () => {
  beforeEach(() => {
    cy.visit(investments.opportunities.index())
    cy.get('#unfiltered-large-capital-opportunity-collection')
      .should('contain', '12 opportunities')
      .and('contain', 'Page 1 of 2')
    cy.intercept('/v4/search/large-capital-opportunity').as('sortResults')
  })

  it('should load sort by dropdown', () => {
    cy.get(`${selectors.entityCollection.sortBy} option`).then((options) => {
      const actual = [...options].map((o) => o.value)
      expect(actual).to.deep.eq([
        'created_on:desc',
        'created_on:asc',
        'name:asc',
      ])
    })
  })

  it('should sort by oldest opportunity', () => {
    cy.get(selectors.entityCollection.sortBy).select('created_on:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.request.body.sortby).to.eq('created_on:asc')
    })
  })

  it('should sort by name AZ', () => {
    cy.get(selectors.entityCollection.sortBy).select('name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.request.body.sortby).to.eq('name:asc')
    })

    cy.get('#unfiltered-large-capital-opportunity-collection')
      .should('contain', '9 opportunities')
      .and('contain', 'Page 1 of 1')
  })
})
