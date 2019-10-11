const selectors = require('../../../../selectors')

describe('Events Collections Filter', () => {
  before(() => {
    cy.visit('/events')
  })

  beforeEach(() => {
    cy.server()
    cy.route('/events?*').as('filterResults')
  })

  it('should filter by country', () => {
    const country = selectors.filter.events.country
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
        'address_country=80756b9a-5d95-e211-a939-e4115bead28a'
      )
    })
  })
})
