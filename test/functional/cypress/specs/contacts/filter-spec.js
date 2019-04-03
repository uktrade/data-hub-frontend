const selectors = require('../../selectors')

describe('Contacts Collections Filter', () => {
  before(() => {
    cy.visit('/contacts?sortby=collectionTest')
    cy.get(selectors.entityCollection.entities).children().should('have.length', 9)
    cy.get(selectors.entityCollection.collection).should('contain', '9 contacts')
  })

  beforeEach(() => {
    cy.server()
    cy.route('/contacts?*').as('filterResults')
  })

  it('should filter by contact name', () => {
    cy.get(selectors.filter.name)
      .type('FilterByContacts')
      .type('{enter}')

    cy.get(selectors.entityCollection.entities).children().should('have.length', 1)
    cy.get(selectors.entityCollection.collection).should('contain', '1 contact matching FilterByContacts')
    cy.get(selectors.entityCollection.collectionRowMessage).should('contain', 'You can now download this contact')
    cy.get(selectors.entityCollection.collectionRowButton).should('be.visible')
  })

  it('should filter by company name', () => {
    cy.get(selectors.filter.contacts.companyName)
      .type('FilterByCompany')
      .type('{enter}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain('?sortby=collectionTest&custom=true&name=FilterByContacts&company_name=FilterByCompany')
    })

    cy.get(selectors.entityCollection.entities).children().should('have.length', 1)
  })

  it('should filter by active status', () => {
    cy.get(selectors.filter.statusActive).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain('name=FilterByContacts&' +
        'company_name=FilterByCompany&' +
        'archived=false')
    })

    cy.get(selectors.entityCollection.entities).children().should('have.length', 1)
  })

  it('should filter by inactive status', () => {
    cy.get(selectors.filter.statusInactive).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain('name=FilterByContacts&' +
      'company_name=FilterByCompany&' +
      'archived=false&' +
      'archived=true')
    })

    cy.get(selectors.entityCollection.entities).children().should('have.length', 1)
  })

  it('should filter by country', () => {
    cy.get(selectors.filter.contacts.firstCountry).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain('name=FilterByContacts&' +
      'company_name=FilterByCompany&' +
      'address_country=87756b9a-5d95-e211-a939-e4115bead28a&' +
      'archived=false&' +
      'archived=true')
    })

    cy.get(selectors.entityCollection.entities).children().should('have.length', 1)
  })

  it('should filter by region', () => {
    cy.get(selectors.filter.contacts.firstUkRegion).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain('name=FilterByContacts&' +
      'company_name=FilterByCompany&' +
      'address_country=87756b9a-5d95-e211-a939-e4115bead28a&' +
      'company_uk_region=934cd12a-6095-e211-a939-e4115bead28a&' +
      'archived=false&' +
      'archived=true')
    })
  })

  it('should remove all filters', () => {
    cy.get(selectors.entityCollection.collectionRemoveAllFilter).click()

    cy.wait('@filterResults')
    cy.get(selectors.entityCollection.collection).should('contain', '9 contacts')
  })
})
