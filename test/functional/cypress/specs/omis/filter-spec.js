const selectors = require('../../../../selectors')

describe('OMIS Collections Filter', () => {
  before(() => {
    cy.visit('/omis')
  })

  beforeEach(() => {
    cy.server()
    cy.route('/omis?*').as('filterResults')
  })

  it('should filter by country', () => {
    const country = selectors.filter.omis.country
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
      expect(xhr.url).to.contain(
        'primary_market=80756b9a-5d95-e211-a939-e4115bead28a'
      )
    })
  })
  it('should filter by region', () => {
    cy.get(selectors.filter.omis.firstUkRegion).click()

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain(
        'uk_region=1718e330-6095-e211-a939-e4115bead28a'
      )
    })
  })
})
