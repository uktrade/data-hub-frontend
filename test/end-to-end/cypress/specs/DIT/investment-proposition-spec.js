const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')
const { formatWithoutParsing } = require('../../../../../src/client/utils/date')
const { DATE_LONG_FORMAT_1 } = require('../../../../../src/common/constants')
const {
  selectFirstAdvisersTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')
const {
  assertFlashMessage,
} = require('../../../../functional/cypress/support/assertions')

const today = new Date()

const createProposition = (data) => {
  cy.get(selectors.entityCollection.addProposition).click()
  cy.get('[data-test=proposition-name-input]').type(data.name)
  cy.get('[data-test=proposition-scope-input]').type(data.scope)
  cy.get('[data-test=proposition_deadline-day]').type(
    formatWithoutParsing(data.date, 'dd')
  )
  cy.get('[data-test=proposition_deadline-month]').type(
    formatWithoutParsing(data.date, 'MM')
  )
  selectFirstAdvisersTypeaheadOption({
    element: '[data-test="field-proposition_assignee"]',
    input: 'DIT Staff',
    mockAdviserResponse: false,
  })
  cy.get('[data-test=proposition_deadline-year]').type(
    formatWithoutParsing(data.date, 'yyyy')
  )
  cy.get('[data-test=submit-button]').click()
}

describe('Proposition', () => {
  const investmentProject =
    fixtures.investmentProject.create.newHotelCommitmentToInvest()
  beforeEach(() => {
    cy.loadFixture([investmentProject])
    cy.visit(investments.projects.propositions(investmentProject.pk))
  })

  it('should create a proposition', () => {
    const data = {
      name: 'Proposition name',
      scope: 'Proposition scope',
      adviser: 'DIT Staff',
      date: today,
    }
    createProposition(data)
    assertFlashMessage('Proposition created')

    cy.get(selectors.collection.items)
      .should('contain', formatWithoutParsing(today, DATE_LONG_FORMAT_1))
      .and('contain', data.name)
      .and('contain', 'DIT Staff')
  })

  it('should abandon a newly created proposition', () => {
    const data = {
      name: 'Prospect name 1',
      scope: 'Abandon scope',
      date: today,
    }
    createProposition(data)

    assertFlashMessage('Proposition created')

    cy.get(`${selectors.collection.items}:contains("${data.name}")`)
      .find('a:contains("Abandon")')
      .first()
      .click()

    cy.get(selectors.investment.proposition.details).type('Not useful anymore')
    cy.get(selectors.investment.proposition.button).click()

    cy.get(selectors.message.successful).should(
      'contain',
      'Proposition abandoned'
    )
  })
})
