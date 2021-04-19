import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../../../src/client/utils/date-utils'

describe('Investment projects summary', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-project-summary-section"]').as(
      'investmentProjectsSummarySection'
    )
  })

  context('Date picker options', () => {
    it('should contain a date select with options in the correct order', () => {
      const yearStart = getFinancialYearStart(new Date())

      const expectedOptions = [
        {
          label: `Current financial year (${generateFinancialYearLabel(
            yearStart
          )})`,
          value: `${yearStart}-04-01`,
        },
        {
          label: `Previous financial year (${generateFinancialYearLabel(
            yearStart - 1
          )})`,
          value: `${yearStart - 1}-04-01`,
        },
        {
          label: 'Upcoming financial year',
          value: `${yearStart + 1}-04-01`,
        },
      ]

      cy.get('@investmentProjectsSummarySection')
        .find('[data-test="data-summary-select"]')
        .should('exist')
        .find('[data-test="data-summary-option"]')
        .should('have.length', 3)
        .each(($el, index) => {
          cy.wrap($el)
            .should('have.text', expectedOptions[index].label)
            .should('have.attr', 'value', expectedOptions[index].value)
        })
    })
  })
})
