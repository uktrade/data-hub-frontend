const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')
const {
  formatDate,
  DATE_FORMAT_FULL,
  DATE_FORMAT_DAY,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_YEAR,
} = require('../../../../../src/client/utils/date-utils')

const {
  selectFirstMockedTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')
const {
  assertFlashMessage,
  assertSummaryTable,
} = require('../../../../functional/cypress/support/assertions')

const today = new Date()
const todayFormatted = formatDate(today, DATE_FORMAT_FULL)

const createProposition = (data) => {
  cy.get(selectors.entityCollection.addProposition).click()
  cy.get('[data-test=proposition-name-input]').type(data.name)
  cy.get('[data-test=proposition-scope-input]').type(data.scope)
  cy.get('[data-test=proposition_deadline-day]').type(
    formatDate(data.date, DATE_FORMAT_DAY)
  )
  cy.get('[data-test=proposition_deadline-month]').type(
    formatDate(data.date, DATE_FORMAT_MONTH)
  )
  selectFirstMockedTypeaheadOption({
    element: '[data-test="field-proposition_assignee"]',
    input: 'DIT Staff',
    mockAdviserResponse: false,
  })
  cy.get('[data-test=proposition_deadline-year]').type(
    formatDate(data.date, DATE_FORMAT_YEAR)
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

    cy.get('[data-test="collection-item"]')
      .should('contain', todayFormatted)
      .and('contain', data.name)
      .and('contain', 'DIT Staff')
  })

  it('should display the proposition details and relevant links', () => {
    cy.get(`[data-test="collection-item"]:contains("Proposition name")`)
      .find('a:contains("Proposition name")')
      .first()
      .click()

    assertSummaryTable({
      dataTest: 'proposition-details-table',
      content: {
        Scope: 'Proposition scope',
        Status: 'Ongoing',
        'Date created': todayFormatted,
        'Modified on': todayFormatted,
        Deadline: todayFormatted,
        'Assigned to': 'DIT Staff',
      },
    })
    cy.get('[data-test="upload-link"]')
      .should('exist')
      .should('have.text', 'Upload files')

    cy.get('[data-test="abandon-link"]')
      .should('exist')
      .should('have.text', 'Abandon proposition')

    cy.get('[data-test="proposition-list-link"]')
      .should('exist')
      .should('have.text', 'View propositions list')

    cy.get('[data-test="complete-button"]').should('not.exist')
  })

  it('should abandon a newly created proposition', () => {
    const data = {
      name: 'Prospect name 1',
      scope: 'Abandon scope',
      date: today,
    }
    createProposition(data)

    assertFlashMessage('Proposition created')

    cy.get(`[data-test="collection-item"]:contains(${data.name})`)
      .find('a:contains("Abandon")')
      .first()
      .click()

    cy.get('[data-test=field-reason]').type('Not useful anymore')
    cy.get('[data-test=submit-button]').click()

    assertFlashMessage('Proposition abandoned')
  })

  it('should render the information for the abandoned proposition', () => {
    cy.get(`[data-test="collection-item"]:contains("Prospect name 1")`)
      .find('a:contains("Prospect name 1")')
      .first()
      .click()

    assertSummaryTable({
      dataTest: 'proposition-details-table',
      content: {
        Scope: 'Abandon scope',
        Status: 'Abandoned',
        'Date created': todayFormatted,
        'Modified on': todayFormatted,
        Deadline: todayFormatted,
        'Assigned to': 'DIT Staff',
        Details: 'Not useful anymore',
      },
    })
    cy.get('[data-test="upload-link"]').should('not.exist')
    cy.get('[data-test="abandon-link"]').should('not.exist')
    cy.get('[data-test="proposition-list-link"]').should('not.exist')
    cy.get('[data-test="complete-button"]').should('not.exist')
  })
})
