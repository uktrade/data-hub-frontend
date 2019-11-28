const selectors = require('../../../../selectors')
const userActions = require('../../support/user-actions')

describe('Contacts', () => {
  const data = {
    name: 'NewAddress',
    lastName: 'Contact',
    jobTitle: 'Coffee machine operator',
    countryCode: '44',
    phone: '0778877778800',
    email: 'company.contact@dit.com',
    address1: 'Rua Candido Portinari',
    address2: 'Numero 521',
    city: 'Campinas',
    country: 'Brazil',
  }

  it('should create a primary contact with a different address to the companies address', () => {
    cy.visit('/contacts/create?company=0fb3379c-341c-4da4-b825-bf8d47b26baa')
    userActions.contacts.createWithNewAddress(data)

    cy.visit('/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa/contacts')
    cy.contains('NewAddress Contact').click()
    cy.get(selectors.contactCreate.details)
      .should('contain', 'Coffee machine operator')
      .and('contain', '(44) 0778877778800')
      .and('contain', 'company.contact@dit.com')
      .and('contain', 'Rua Candido Portinari, Numero 521, Campinas, Brazil')
  })
})
