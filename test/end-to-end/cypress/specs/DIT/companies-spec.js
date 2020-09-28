const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const userActions = require('../../support/user-actions')

const { companies, contacts } = require('../../../../../src/lib/urls')

const { assertKeyValueTable } = require('../../support/assertions')

const { oneListCorp, lambdaPlc, emptyUkRegionLtd } = fixtures.company

describe('Advisors', () => {
  const globalManagerTable = 2
  const adviserTable = 3

  it('should display advisers for a GHQ for a given company', () => {
    cy.visit(companies.advisers.index(oneListCorp.id))

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
  const company = {
    pk: '1233379c-341c-4da4-b825-bf8d47b26baa',
    model: 'company.company',
    fields: {
      name: '1 2 3 testing',
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      export_to_countries: [
        '82756b9a-5d95-e211-a939-e4115bead28a',
        '83756b9a-5d95-e211-a939-e4115bead28a',
      ],
      future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: '100 Path',
      address_town: 'A town',
      address_postcode: '12345',
      address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: '100 Path',
      registered_address_town: 'A town',
      registered_address_postcode: '12345',
      registered_address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing',
      created_on: '2017-10-16T11:00:00Z',
      modified_on: '2017-11-16T11:00:00Z',
    },
  }

  before(() => {
    cy.loadFixture([company])
  })

  const data = {
    name: 'Company',
    lastName: 'Contact',
    jobTitle: 'Coffee machine operator',
    countryCode: '44',
    phone: '0778877778800',
    email: 'company.contact@dit.com',
  }

  it('should create a contact for a given company', () => {
    cy.visit(contacts.create(company.pk))
    userActions.contacts.create(data)

    cy.get(selectors.message.successful).should('contain', 'Added new contact')

    assertKeyValueTable('bodyMainContent', {
      'Job title': 'Coffee machine operator',
      'Phone number': '(44) 0778877778800',
      Address: '100 Path, A town, 12345, United States',
      Email: 'company.contact@dit.com',
      'Email marketing': 'Cannot be marketed to',
    })
  })

  it('should display the newly created contact in company contact collection page', () => {
    cy.visit(companies.activity.index(company.pk))

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
      cy.get('@exportTds').eq(index).should('have.text', value)
    })
  }

  describe('Edit exports', () => {
    function runEditTests() {
      context('Selecting a value', () => {
        it('Should update the export win category', () => {
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
    }

    context('With lambdaPlc (which has a UK Region set)', () => {
      beforeEach(() => {
        cy.visit(companies.exports.edit(lambdaPlc.id))
      })

      runEditTests()
    })

    context('With emptyUkRegionLtd (which does not have UK Region set)', () => {
      beforeEach(() => {
        cy.visit(companies.exports.edit(emptyUkRegionLtd.id))
      })

      runEditTests()
    })
  })

  context('Editing export countries', () => {
    context(
      'With no existing values and without changing the export countries',
      () => {
        it('Should return back to the export tab with no changes', () => {
          cy.visit(companies.exports.editCountries(lambdaPlc.id))
          cy.contains('button', 'Save and return').click()

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
      context('Adding two countries to currently exporting', () => {
        it('Should add the countries and display them in alphabetical order', () => {
          cy.visit(companies.exports.editCountries(lambdaPlc.id))

          cy.get(selectors.companyExport.countries.export)
            .selectTypeaheadOption('Germ')
            .selectTypeaheadOption('Fran')

          cy.contains('button', 'Save and return').click()

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
          cy.visit(companies.exports.editCountries(lambdaPlc.id))
          cy.contains('button', 'Save and return').click()

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

      context('Adding the same country to more than one field', () => {
        it('Should show an error', () => {
          cy.visit(companies.exports.editCountries(lambdaPlc.id))
          cy.get(
            selectors.companyExport.countries.future
          ).selectTypeaheadOption('Germ')
          cy.contains('button', 'Save and return').click()
          cy.contains('You cannot enter the same country in multiple fields.')
        })
      })

      context('Editing all countries', () => {
        it('should update the countries', () => {
          cy.visit(companies.exports.editCountries(lambdaPlc.id))

          cy.get(
            selectors.companyExport.countries.export
          ).selectTypeaheadOption('Bra')
          cy.get(
            selectors.companyExport.countries.future
          ).selectTypeaheadOption('Hon')
          cy.get(
            selectors.companyExport.countries.noInterest
          ).selectTypeaheadOption('Chi')

          cy.contains('button', 'Save and return').click()

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

      context('Removing all countries', () => {
        it('Should save the export countries as empty', () => {
          cy.visit(companies.exports.editCountries(lambdaPlc.id))

          cy.get(
            selectors.companyExport.countries.export
          ).removeAllTypeaheadValues()
          cy.get(
            selectors.companyExport.countries.future
          ).removeAllTypeaheadValues()
          cy.get(
            selectors.companyExport.countries.noInterest
          ).removeAllTypeaheadValues()

          cy.contains('button', 'Save and return').click()

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
  })
})
