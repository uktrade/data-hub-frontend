import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../../../src/client/utils/date-utils'

const PROSPECT_ID = '8a320cc9-ae2e-443e-9d26-2f36452c2ced'
const ASSIGN_PM_ID = 'c9864359-fb1a-4646-a4c1-97d10189fc03'
const ACTIVE_ID = '7606cc19-20da-4b74-aba1-2cec0d753ad8'
const VERIFY_WIN_ID = '49b8f6f3-0c50-4150-a965-2c974f3149e3'
const WON_ID = '945ea6d1-eee3-4f5b-9144-84a75b71b8e6'

const ADVISER_ID = 'e83a608e-84a4-11e6-ae22-56b6b6499622'

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

  context('Common elements to both Chart and Table views', () => {
    it('should display an "Investment project summary" toggle', () => {
      cy.get('[data-test=toggle-section-button-content]').should(
        'contain',
        'Investment project summary'
      )
    })

    it('should display the "Date range" label', () => {
      cy.get('[data-test="data-summary-select"]').should(
        'contain',
        'Date range'
      )
    })

    it('should display a date select with options in the correct order', () => {
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

    it('should display a button to toggle the views', () => {
      cy.get('[data-test="toggle-views"]').should('exist')
    })
  })

  context('Chart view', () => {
    it('should display a button "Change to table and accessible view"', () => {
      cy.get('[data-test="toggle-views"]').should(
        'contain',
        'Change to table and accessible view'
      )
    })
    it('should display an SVG representing a chart', () => {
      cy.get('[data-test="pie-chart"]').find('svg').should('exist')
    })
    it('should display 7 projects', () => {
      cy.get('[data-test="pie-chart"]')
        .should('contain', '7')
        .should('contain', 'Projects')
    })
    it('should display a chart legend of all five stages', () => {
      cy.get('[data-test="pie-chart"]')
        .should('contain', 'Prospect')
        .should('contain', 'Assign PM')
        .should('contain', 'Active')
        .should('contain', 'Verify Win')
        .should('contain', 'Won')
    })
  })

  context('Table view', () => {
    before(() => {
      cy.get('[data-test="toggle-views"]').click()
    })
    it('should display a button "Change to chart view"', () => {
      cy.get('[data-test="toggle-views"]').should(
        'contain',
        'Change to chart view'
      )
    })
    it('should display project information within a blue box', () => {
      cy.get('[data-test="investment-project-total"]')
        .should('contain', 'Current year')
        .should('contain', '7')
        .should('contain', 'Projects')
    })
    it('should display a table with 6 rows and two columns', () => {
      const table = [
        ['Stage', 'Projects'],
        ['Prospect', 3],
        ['Assign PM', 0],
        ['Active', 0],
        ['Verify Win', 1],
        ['Won', 3],
      ]
      cy.get('[data-test="investment-project-table"]')
        .find('tr')
        .each((el, row) => {
          cy.wrap(el)
            .children()
            .each((el, col) => {
              cy.wrap(el).should('contain', table[row][col])
            })
        })
    })
    it('should have five hyperlinks, one for each stage', () => {
      const IDS = [PROSPECT_ID, ASSIGN_PM_ID, ACTIVE_ID, VERIFY_WIN_ID, WON_ID]
      const TITLES = [
        'View Prospect',
        'View Assign PM',
        'View Active',
        'View Verify Win',
        'View Won',
      ]
      cy.get('[data-test="investment-project-table"]')
        .find('a')
        .should('have.length', 5)
        .each((el, i) => {
          cy.wrap(el)
            .should(
              'have.attr',
              'href',
              `/investments/projects?stage=${IDS[i]}&adviser=${ADVISER_ID}`
            )
            .should('have.attr', 'title', TITLES[i])
        })
    })
  })
})
