const selectors = require('../../../../selectors')
const userActions = require('../../support/user-actions')

const { companies, contacts } = require('../../../../../src/lib/urls')

const { assertKeyValueTable } = require('../../support/assertions')

describe('Advisors', () => {
  const globalManagerTable = 2
  const adviserTable = 3

  it('should display advisers for a GHQ for a given company', () => {
    cy.visit(companies.advisers.index('375094ac-f79a-43e5-9c88-059a7caa17f0'))

    cy.get(selectors.collection.contentHeader).should(
      'contain',
      'Advisers on the core team'
    )

    cy.get(selectors.collection.contentTable(globalManagerTable))
      .should('contain', 'IST - Sector Advisory Services')
      .and('contain', 'London')
      .and('contain', 'Travis Greene')

    cy.get(selectors.collection.contentTable(adviserTable))
      .should('contain', 'Heart of the South West LEP')
      .and('contain', 'South West')
      .and('contain', 'Holly Collins')
      .and('contain', 'IG - Specialists - Knowledge Intensive Industry')
      .and('contain', 'London')
      .and('contain', 'Jenny Carey')
  })
})

describe('Contacts', () => {
  const data = {
    name: 'Company',
    lastName: 'Contact',
    jobTitle: 'Coffee machine operator',
    countryCode: '44',
    phone: '0778877778800',
    email: 'company.contact@dit.com',
  }

  it('should create a contact for a given company', () => {
    cy.visit(contacts.create('0fb3379c-341c-4da4-b825-bf8d47b26baa'))
    userActions.contacts.create(data)

    cy.get(selectors.message.successful).should('contain', 'Added new contact')

    assertKeyValueTable('bodyMainContent', {
      'Job title': 'Coffee machine operator',
      'Phone number': '(44) 0778877778800',
      Address: "12 St George's Road, Paris, 75001, France",
      Email: 'company.contact@dit.com',
      'Email marketing': 'Can be marketed to',
    })
  })

  it('should display the newly created contact in company contact collection page', () => {
    cy.visit(companies.activity.index('0fb3379c-341c-4da4-b825-bf8d47b26baa'))

    cy.contains('Company contacts').click()
    cy.get(selectors.collection.items)
      .should('contain', 'Company Contact')
      .and('contain', 'Coffee machine operator')
      .and('contain', '(44) 0778877778800')
      .and('contain', 'company.contact@dit.com')
  })
})

describe('Export', () => {
  it('should update export values when edit is made', () => {
    cy.visit(companies.exports.edit('0fb3379c-341c-4da4-b825-bf8d47b26baa'))

    cy.get(selectors.companyExport.winCategory).select('Export growth')
    cy.get(selectors.companyForm.save).click()

    cy.get(selectors.collection.table)
      .should('contain', 'Export growth')
      .and('contain', 'France, Germany')
      .and('contain', 'Yemen')
      .and('contain', 'No profile')
      .and('contain', 'No score given')
  })

  it('should update export values when edit is made', () => {
    cy.visit(companies.exports.edit('0fb3379c-341c-4da4-b825-bf8d47b26baa'))

    cy.get(selectors.companyExport.winCategory).select('Export growth')
    cy.get(selectors.companyForm.save).click()

    cy.get(selectors.collection.table)
      .should('contain', 'Export growth')
      .and('contain', 'France, Germany')
      .and('contain', 'Yemen')
      .and('contain', 'No profile')
      .and('contain', 'No score given')
  })
})
