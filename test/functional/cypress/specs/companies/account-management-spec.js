import { faker } from '@faker-js/faker'
import { companyFaker } from '../../fakers/companies'
import { userFaker } from '../../fakers/users'
import { format } from 'date-fns'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id
describe('Company account management', () => {
  const companyWithStrategy = companyFaker({
    strategy: 'ABC',
    id: companyId,
    modifiedBy: userFaker(),
    modifiedOn: faker.date.past(),
  })

  context('When visiting the account management page with a strategy', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/company/${companyId}`,
        companyWithStrategy
      ).as('companyApi')
      cy.visit(urls.companies.accountManagement.index(companyId))
    })

    it('should display the strategy heading', () => {
      cy.get('h2').contains('Strategy')
    })

    it('should display the edit history details link', () => {
      cy.get('[data-test="edit-history-link"]').should(
        'have.attr',
        'href',
        urls.companies.editHistory.index(companyId)
      )
    })

    it('should display the updated by information', () => {
      cy.get('[data-test="last-updated-details"] > span')
        .eq(0)
        .contains(
          `Last updated by ${companyWithStrategy.modifiedBy.name}: ${format(
            companyWithStrategy.modifiedOn,
            'dd MMM yyyy'
          )}. `
        )
    })

    it('should display the edit strategy link', () => {
      cy.get('[data-test="edit-strategy-link"]').should(
        'have.attr',
        'href',
        urls.companies.accountManagement.create(companyId)
      )
    })
  })

  context(
    'When visiting the account management page without a strategy',
    () => {
      before(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/company/${companyId}`,
          companyFaker({ strategy: undefined, id: companyId })
        ).as('companyApi')
        cy.visit(urls.companies.accountManagement.index(companyId))
      })

      it('should display the strategy heading', () => {
        cy.get('h2').contains('Strategy')
      })

      it('should display the add strategy button', () => {
        cy.get('[data-test="add-strategy-button"]').should(
          'have.attr',
          'href',
          urls.companies.accountManagement.create(companyId)
        )
      })
    }
  )
})
