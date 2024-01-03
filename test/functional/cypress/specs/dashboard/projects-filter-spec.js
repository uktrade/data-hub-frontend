import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'
import { investmentProjectListFaker } from '../../fakers/investment-projects'
import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import { assertPayload } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'
import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../../../src/client/utils/date'
import {
  STAGE_ACTIVE,
  STAGE_ASSIGN_PM,
  STAGE_PROSPECT,
  STAGE_VERIFY_WIN,
  STAGE_WON,
} from '../../../../../src/client/modules/Investments/Projects/constants'

const myAdviser = {
  id: '7d19d407-9aec-4d06-b190-d3f404627f21',
  name: 'Barry Oling',
}
const prospectStageId = '8a320cc9-ae2e-443e-9d26-2f36452c2ced'
const ongoingStatusId = 'ongoing'

const minimumPayload = {
  adviser: myAdviser.id,
  limit: 10,
  offset: 0,
  sortby: 'created_on:desc',
  show_summary: true,
}

const transformOptions = (options) =>
  [...options].map((o) => ({
    value: o.value,
    label: o.label,
  }))

describe('Dashboard - my projects list filters', () => {
  const summary = investmentProjectSummaryFaker()

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => cy.clearSessionStorage())

  context('When a filter is applied and there are zero projects', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/investment_project', (req) => {
        req.reply(
          req.body.stage === INVESTMENT_PROJECT_STAGES.verifyWin.id
            ? { body: { count: 0, results: [], summary } }
            : {
                body: {
                  count: 10,
                  results: investmentProjectListFaker(10),
                  summary,
                },
              }
        )
      }).as('apiRequest')
      cy.visit(urls.dashboard.investmentProjects())
      cy.wait('@apiRequest')
    })

    it('should display "No investment projects"', () => {
      cy.get('[data-test="stage-select"] select').select(STAGE_VERIFY_WIN)
      cy.wait('@apiRequest')

      cy.get('[data-test="tabpanel"] p').should(
        'have.text',
        'No investment projects'
      )
    })
  })
  context('Dashboard filter options', () => {
    it('should render the stage options', () => {
      cy.get('[data-test="stage-select"] option').then((stageOptions) => {
        expect(transformOptions(stageOptions)).to.deep.eq([
          { value: 'all-stages', label: 'Show all' },
          {
            value: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
            label: STAGE_PROSPECT,
          },
          {
            value: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
            label: STAGE_ASSIGN_PM,
          },
          {
            value: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
            label: STAGE_ACTIVE,
          },
          {
            value: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
            label: STAGE_VERIFY_WIN,
          },
          { value: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6', label: STAGE_WON },
        ])
      })
    })
    it('should render the status options', () => {
      cy.get('[data-test="status-select"] option').then((statusOptions) => {
        expect(transformOptions(statusOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'delayed', label: 'Delayed' },
          { value: 'abandoned', label: 'Abandoned' },
          { value: 'lost', label: 'Lost' },
          { value: 'dormant', label: 'Dormant' },
        ])
      })
    })
    it('should render the land date options', () => {
      const financialYearStart = getFinancialYearStart(new Date())
      cy.get('[data-test="land-date-select"] option').then(
        (landDateOptions) => {
          expect(transformOptions(landDateOptions)).to.deep.eq([
            { value: 'all-land-dates', label: 'Show all' },
            {
              value: `${financialYearStart}`,
              label: `Current year ${generateFinancialYearLabel(
                financialYearStart
              )}`,
            },
            {
              value: `${financialYearStart - 1}`,
              label: `Last year ${generateFinancialYearLabel(
                financialYearStart - 1
              )}`,
            },
            {
              value: `${financialYearStart + 1}`,
              label: `Next year ${generateFinancialYearLabel(
                financialYearStart + 1
              )}`,
            },
          ])
        }
      )
    })
    it('should render the sort options', () => {
      cy.get('[data-test="sort-select"] option').then((sortOptions) => {
        expect(transformOptions(sortOptions)).to.deep.eq([
          { value: 'created_on:desc', label: 'Recently created' },
          { value: 'modified_on:desc', label: 'Recently updated' },
          { value: 'estimated_land_date:asc', label: 'Earliest land date' },
          { value: 'estimated_land_date:desc', label: 'Latest land date' },
          { value: 'name:asc', label: 'Project name (A-Z)' },
          { value: 'name:desc', label: 'Project name (Z-A)' },
        ])
      })
    })
  })

  context('When filters are applied', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v3/search/investment_project').as(
        'apiRequest'
      )
      cy.visit(urls.dashboard.investmentProjects())
      cy.wait('@apiRequest')
    })
    it('should filter by stage', () => {
      cy.get('[data-test="stage-select"] select').select(STAGE_PROSPECT)
      cy.wait('@apiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        stage: prospectStageId,
      })
    })
    it('should filter by status', () => {
      cy.get('[data-test="status-select"] select').select('Ongoing')
      cy.wait('@apiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        status: ongoingStatusId,
      })
    })
    it('should filter by land date', () => {
      cy.wait('@apiRequest')
      const financialYearStart = getFinancialYearStart(new Date()).toString()
      cy.get('[data-test="land-date-select"] select').select(financialYearStart)
      assertPayload('@apiRequest', {
        ...minimumPayload,
        land_date_financial_year_start: [financialYearStart],
      })
    })
  })

  context('When the user leaves the page and comes back', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v3/search/investment_project').as(
        'apiRequest'
      )
      cy.visit(urls.dashboard.investmentProjects())
      cy.wait('@apiRequest')
    })

    it('should persist filter by stage', () => {
      cy.get('[data-test="stage-select"] select').select(STAGE_PROSPECT)
      cy.wait('@apiRequest')
      cy.visit('/companies')
      cy.visit(urls.dashboard.investmentProjects())
      cy.get('[data-test="stage-select"] select')
        .find(':selected')
        .contains(STAGE_PROSPECT)
    })

    it('should persist filter by status', () => {
      cy.get('[data-test="status-select"] select').select('Ongoing')
      cy.wait('@apiRequest')
      cy.visit('/companies')
      cy.visit(urls.dashboard.investmentProjects())
      cy.get('[data-test="status-select"] select')
        .find(':selected')
        .contains('Ongoing')
    })

    it('should persist filter by land date', () => {
      const financialYearStart = getFinancialYearStart(new Date()).toString()
      cy.get('[data-test="land-date-select"] select').select(financialYearStart)
      cy.wait('@apiRequest')
      cy.visit('/companies')
      cy.visit(urls.dashboard.investmentProjects())
      cy.get('[data-test="land-date-select"] select')
        .find(':selected')
        .contains(financialYearStart)
    })

    it('should persist sort by', () => {
      cy.get('[data-test="sort-select"] select').select('Latest land date')
      cy.wait('@apiRequest')
      cy.visit('/companies')
      cy.visit(urls.dashboard.investmentProjects())
      cy.get('[data-test="sort-select"] select')
        .find(':selected')
        .contains('Latest land date')
    })
  })
})
