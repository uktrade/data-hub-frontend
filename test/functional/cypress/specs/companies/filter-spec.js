const selectors = require('../../selectors')

describe('Company Collections Filter', () => {
  before(() => {
    cy.visit('/companies?sortby=collectionTest')
    cy
      .get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 9)
    cy
      .get(selectors.entityCollection.collection)
      .should('contain', '100,172 companies')
  })

  beforeEach(() => {
    cy.server()
    cy.route('/companies?*').as('filterResults')
  })

  it('should filter by name', () => {
    cy
      .get(selectors.filter.name)
      .type('FilterByCompany')
      .type('{enter}')

    cy
      .get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
    cy
      .get(selectors.entityCollection.collection)
      .should('contain', '1 company matching FilterByCompany')
    cy
      .get(selectors.entityCollection.collectionRowMessage)
      .should('contain', 'You can now download this company')
    cy.get(selectors.entityCollection.collectionRowButton).should('be.visible')
  })

  it('should filter by active status', () => {
    cy.get(selectors.filter.statusActive).click()

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain(
        '?sortby=collectionTest&custom=true&name=FilterByCompany&archived=false'
      )
    })

    cy
      .get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should filter by inactive status', () => {
    cy.get(selectors.filter.statusInactive).click()

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain(
        '?sortby=collectionTest&custom=true&name=FilterByCompany&archived=false&archived=true'
      )
    })

    cy
      .get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should filter by sector', () => {
    const sector = selectors.filter.sector
    const { typeahead } = selectors.filter
    cy
      .get(typeahead(sector).selectedOption)
      .click()
      .get(typeahead(sector).textInput)
      .type('Advanced Engineering')
      .get(typeahead(sector).options)
      .should('have.length', 1)
      .get(typeahead(sector).firstOption)
      .click()

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain(
        'sector_descends=af959812-6095-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by country', () => {
    const country = selectors.filter.country
    const { typeahead } = selectors.filter

    cy
      .get(typeahead(country).selectedOption)
      .click()
      .get(typeahead(country).textInput)
      .type('United Kingdom')
      .get(typeahead(country).options)
      .should('have.length', 1)
      .get(typeahead(country).firstOption)
      .click()

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain('country=80756b9a-5d95-e211-a939-e4115bead28a')
    })
  })

  it('should filter by region', () => {
    cy.get(selectors.filter.firstUkRegion).click()

    cy.wait('@filterResults').then(xhr => {
      expect(xhr.url).to.contain(
        'uk_region=934cd12a-6095-e211-a939-e4115bead28a'
      )
    })

    cy
      .get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should remove all filters', () => {
    cy.get(selectors.entityCollection.collectionRemoveAllFilter).click()
    cy
      .get(selectors.entityCollection.collection)
      .should('contain', '100,172 companies')
  })
})
