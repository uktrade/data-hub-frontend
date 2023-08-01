const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldTextarea,
  assertBreadcrumbs,
} = require('../../support/assertions')

const company = fixtures.company.allActivitiesCompany

const companyAccountManagementUrl = urls.companies.accountManagement.index(
  company.id
)

describe('Company account management strategy', () => {
  context('When visiting the strategy create page', () => {
    it('should display the header', () => {
      cy.visit(urls.companies.accountManagement.create(company.id))
      cy.get('h1').should('have.text', `Add strategy for ${company.name}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [company.name]: urls.companies.detail(company.id),
        'Account management': urls.companies.accountManagement.index(
          company.id
        ),
        [`Strategy for ${company.name}`]: null,
      })
    })

    it('should display the strategy field', () => {
      cy.get('[data-test="field-strategy"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Strategy',
          hint: "This should outline a plan than provides a concise overview of the business direction and DBT's approach to help them achieve that.",
        })
      })
    })

    it('save strategy button should link to company account management page', () => {
      cy.get('[data-test="submit-button"]').contains('Save strategy').click()
      cy.location('pathname').should('eq', companyAccountManagementUrl)
      cy.go('back')
    })

    it('cancels form when back link is clicked', () => {
      cy.get('[data-test="cancel-button"]').contains('Back').click()
      cy.location('pathname').should('eq', companyAccountManagementUrl)
      cy.go('back')
    })
  })
})
