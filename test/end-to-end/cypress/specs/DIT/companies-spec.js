const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const userActions = require('../../support/user-actions')

const { companies, contacts } = require('../../../../../src/lib/urls')

const { assertKeyValueTable } = require('../../support/assertions')

describe('Advisors', () => {
  const globalManagerTable = 2
  const adviserTable = 3

  it('should display advisers for a GHQ for a given company', () => {
    cy.visit(companies.advisers.index(fixtures.company.oneListCorp.id))

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
    cy.visit(contacts.create(fixtures.company.lambdaPlc.id))
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
    cy.visit(companies.activity.index(fixtures.company.lambdaPlc.id))

    cy.contains('Company contacts').click()
    cy.get(selectors.collection.items)
      .should('contain', 'Company Contact')
      .and('contain', 'Coffee machine operator')
      .and('contain', '(44) 0778877778800')
      .and('contain', 'company.contact@dit.com')
  })
})

describe('Export', () => {
  function assertTable(values) {
    cy.get('td').as('exportTds')

    values.forEach((value, index) => {
      cy.get('@exportTds')
        .eq(index)
        .should('have.text', value)
    })
  }

  describe('Edit exports', () => {
    context('Selecting a value', () => {
      it('Should update the export win category', () => {
        cy.visit(companies.exports.edit(fixtures.company.lambdaPlc.id))

        cy.get(selectors.companyExport.winCategory).select('Export growth')
        cy.contains('Save and return').click()

        assertTable([
          'Export growth',
          'No profile',
          'No score given',
          'None',
          'None',
          'None',
        ])
      })
    })

    context('Selecting no value', () => {
      it('Should remove the export win category', () => {
        cy.visit(companies.exports.edit(fixtures.company.lambdaPlc.id))

        cy.get(selectors.companyExport.winCategory).select(
          '-- Select category --'
        )
        cy.contains('Save and return').click()

        assertTable([
          'None',
          'No profile',
          'No score given',
          'None',
          'None',
          'None',
        ])
      })
    })
  })

  context('Editing export countries', () => {
    context(
      'With no existing values and without changing the export countries',
      () => {
        it('Should return back to the export tab with no changes', () => {
          cy.visit(
            companies.exports.editCountries(fixtures.company.lambdaPlc.id)
          )
          cy.get(selectors.companyForm.save).click()

          assertTable([
            'None',
            'No profile',
            'No score given',
            'None',
            'None',
            'None',
          ])
        })
      }
    )

    context('Adding export countries', () => {
      function selectCountry(id, text) {
        const typeahead = `${id} .multiselect`
        const textInput = `${id} .multiselect__input`

        cy.get(typeahead)
          .click()
          .get(textInput)
          .type(text)
          .type('{enter}')
          .type('{esc}')
      }

      context('Adding two countries to currently exporting', () => {
        it('Should add the countries and display them in alphabetical order', () => {
          cy.visit(
            companies.exports.editCountries(fixtures.company.lambdaPlc.id)
          )

          selectCountry(selectors.companyExport.countries.export, 'Germ')
          selectCountry(selectors.companyExport.countries.export, 'Fran')
          cy.get(selectors.companyForm.save).click()

          assertTable([
            'None',
            'No profile',
            'No score given',
            'France, Germany',
            'None',
            'None',
          ])
        })
      })

      context('Without changing the export countries again', () => {
        it('Should return back to the export tab with no changes', () => {
          cy.visit(
            companies.exports.editCountries(fixtures.company.lambdaPlc.id)
          )
          cy.get(selectors.companyForm.save).click()

          assertTable([
            'None',
            'No profile',
            'No score given',
            'France, Germany',
            'None',
            'None',
          ])
        })
      })

      context('Editing all countries', () => {
        it('should update the countries', () => {
          cy.visit(
            companies.exports.editCountries(fixtures.company.lambdaPlc.id)
          )

          selectCountry(selectors.companyExport.countries.export, 'Bra')
          selectCountry(selectors.companyExport.countries.future, 'Hon')
          selectCountry(selectors.companyExport.countries.noInterest, 'Chi')
          cy.get(selectors.companyForm.save).click()

          assertTable([
            'None',
            'No profile',
            'No score given',
            'Brazil, France, Germany',
            'Honduras',
            'Chile',
          ])
        })
      })
    })
  })
})
