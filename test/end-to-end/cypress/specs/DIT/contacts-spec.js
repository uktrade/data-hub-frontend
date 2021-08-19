const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const userActions = require('../../support/user-actions')

const { contacts } = require('../../../../../src/lib/urls')

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
    const company = fixtures.company.create.defaultCompany('contact testing')
    cy.loadFixture([company])

    cy.visit(contacts.create(company.pk))
    userActions.contacts.createWithNewAddress(data)

    cy.get(selectors.contactCreate.details)
      .should('contain', 'Coffee machine operator')
      .and('contain', '(44) 0778877778800')
      .and('contain', 'company.contact@dit.com')
      .and('contain', 'Rua Candido Portinari, Numero 521, Campinas, Brazil')
  })

  it('Create with duplicate email', () => {
    const EMAIL = 'andy.pipkin@andyandlou.co.uk'
    const company = fixtures.company.create.defaultCompany('contact testing')
    cy.loadFixture([company])
    cy.visit(contacts.create(company.pk))

    cy.checkRadioGroup(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )
    cy.checkRadioGroup('Is this person a primary contact?', 'Yes')
    cy.typeIntoInputs({
      'First name': 'Andy',
      'Last name': 'Pipkin',
      'Job title': 'On dole',
      'Telephone country code': '1234',
      'Telephone number': '56789',
      Email: EMAIL,
    })

    cy.clickSubmitButton('Add contact')
    cy.contains('You have successfully added a new contact Andy Pipkin')

    cy.visit(contacts.create(company.pk))

    cy.checkRadioGroup(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )
    cy.checkRadioGroup('Is this person a primary contact?', 'Yes')
    cy.typeIntoInputs({
      'First name': 'Lou',
      'Last name': 'Todd',
      'Job title': 'Carer',
      'Telephone country code': '4567',
      'Telephone number': '987654321',
      Email: EMAIL,
    })

    cy.clickSubmitButton('Add contact')

    cy.contains('You have successfully added a new contact').should('not.exist')
    cy.contains(
      `The email ${EMAIL} already exists at contact testing. ` +
        "To continue adding this contact select 'Add contact'. " +
        "To return to the previous screen, select 'Cancel'."
    )

    cy.clickSubmitButton('Add contact')
    cy.contains('You have successfully added a new contact Lou Todd')
  })
})
