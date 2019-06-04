const selectors = require('../../selectors')

describe('Investments Collections Filter', () => {
  before(() => {
    cy.visit('/investments')
    cy
      .get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 10)
  })

  beforeEach(() => {
    cy.server()
    cy.route('/investments/projects?*').as('filterResults')
  })

  it('should filter by sector', () => {
    const sector = selectors.filter.investments.sector
    const { typeahead } = selectors.filter
    cy
      .get(typeahead(sector).selectedOption)
      .click()
      .get(typeahead(sector).textInput)
      .type('Advanced Engineering')
      .get(typeahead(sector).options)
      .should('have.length', 1)
      .get(typeahead(sector).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain(
        'sector_descends=af959812-6095-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by country', () => {
    const country = selectors.filter.investments.country
    const { typeahead } = selectors.filter

    cy
      .get(typeahead(country).selectedOption)
      .click()
      .get(typeahead(country).textInput)
      .type('United Kingdom')
      .get(typeahead(country).options)
      .should('have.length', 1)
      .get(typeahead(country).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain('country=80756b9a-5d95-e211-a939-e4115bead28a')
    })
  })
})
