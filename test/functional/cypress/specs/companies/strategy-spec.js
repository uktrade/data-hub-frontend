const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldTextarea,
  assertBreadcrumbs,
  assertFlashMessage,
  assertPayload,
} = require('../../support/assertions')

const { fill } = require('../../support/form-fillers')

const dnbCorpCompany = fixtures.company.dnbCorp
const dnbCorpCompanyUrl = urls.companies.accountManagement.index(
  dnbCorpCompany.id
)

const allActivitiesCompany = fixtures.company.allActivitiesCompany
const allActivitiesCompanyUrl = urls.companies.accountManagement.index(
  allActivitiesCompany.id
)

describe('Company account management strategy', () => {
  context('When visiting the strategy create page', () => {
    beforeEach(() => {
      cy.intercept('PATCH', `/api-proxy/v4/company/${dnbCorpCompany.id}`).as(
        'apiRequest'
      )
      cy.visit(urls.companies.accountManagement.create(dnbCorpCompany.id))
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Add strategy for ${dnbCorpCompany.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [dnbCorpCompany.name]: urls.companies.detail(dnbCorpCompany.id),
        'Account management': urls.companies.accountManagement.index(
          dnbCorpCompany.id
        ),
        [`Strategy for ${dnbCorpCompany.name}`]: null,
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
      fill('[data-test=field-strategy]', 'test strategy')
      cy.get('[data-test="submit-button"]').contains('Save strategy').click()
      assertPayload('@apiRequest', {
        strategy: 'test strategy',
      })
      cy.location('pathname').should('eq', dnbCorpCompanyUrl)
    })

    it('cancels form when back link is clicked', () => {
      cy.get('[data-test="cancel-button"]').contains('Back').click()
      cy.location('pathname').should('eq', dnbCorpCompanyUrl)
    })

    it('displays a success flash message when form is submitted', () => {
      cy.get('[data-test="submit-button"]').contains('Save strategy').click()
      assertFlashMessage('Strategy saved')
    })
  })
  context('When visiting the strategy edit page', () => {
    beforeEach(() => {
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/company/${allActivitiesCompany.id}`
      ).as('apiRequest')
      cy.visit(urls.companies.accountManagement.edit(allActivitiesCompany.id))
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Edit strategy for ${allActivitiesCompany.name}`
      )
    })

    it('should edit the strategy field', () => {
      cy.get('[data-test="field-strategy"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Strategy',
          hint: "This should outline a plan than provides a concise overview of the business direction and DBT's approach to help them achieve that.",
          value: allActivitiesCompany.strategy,
        })
        cy.get('[id="strategy"]').clear()
        fill('[data-test=field-strategy]', 'test strategy')
        cy.get('[data-test="submit-button"]').contains('Save strategy').click()
        assertPayload('@apiRequest', {
          strategy: 'test strategy',
        })
      })
    })

    it('cancels form when back link is clicked', () => {
      cy.get('[data-test="cancel-button"]').contains('Back').click()
      cy.location('pathname').should('eq', allActivitiesCompanyUrl)
    })

    it('displays a success flash message when form is submitted', () => {
      cy.get('[data-test="submit-button"]').contains('Save strategy').click()
      assertFlashMessage('Strategy saved')
    })
  })
})
