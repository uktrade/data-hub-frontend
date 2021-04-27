const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const userActions = require('../../support/user-actions')

const { contacts } = require('../../../../../src/lib/urls')

describe('Contacts', () => {
  const data = {
    name: 'NewAddress',
    lastName: 'Contact',
    jobTitle: 'Coffee machine operator',
    countryCode: '+44',
    phone: '0778877778800',
    email: 'company.contact@dit.com',
    address1: 'Rua Candido Portinari',
    address2: 'Numero 521',
    city: 'Campinas',
    country: 'Brazil',
  }

  it('should create a primary contact with a different address to the companies address', () => {
    const company = fixtures.company.create.defaultCompany('contact testing')
    cy.loadFixture([company])

    cy.visit(contacts.create(company.pk))
    userActions.contacts.createWithNewAddress(data)

    cy.get(selectors.contactCreate.details)
      .should('contain', 'Coffee machine operator')
      .and('contain', '(+44) 0778877778800')
      .and('contain', 'company.contact@dit.com')
      .and('contain', 'Rua Candido Portinari, Numero 521, Campinas, Brazil')
  })
})
