import urls from '../../../../../src/lib/urls'
import fixtures from '../../fixtures'
import { assertSummaryTable } from '../../support/assertions'
import {
  EXPORT_REVENUE_FALSE,
  EXPORT_REVENUE_TRUE,
  NEW_TECH_TRUE,
  NEW_TECH_FALSE,
  R_AND_D_TRUE,
  R_AND_D_FALSE,
} from '../../../../../src/client/modules/Investments/Projects/constants'

const NOT_KNOWN = 'Not known'

describe('Invesment project evaluation', () => {
  context('When viewing a project with no evaluation fields set', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.evaluation(
          fixtures.investment.investmentWithoutEvaluation.id
        )
      )
    })

    it('should render the value table correctly', () => {
      assertSummaryTable({
        dataTest: 'project-value-table',
        content: {
          'Primary sector': NOT_KNOWN,
          'Total investment': NOT_KNOWN,
          'Number of new jobs': NOT_KNOWN,
          'Average salary': NOT_KNOWN,
          'R&D budget': NOT_KNOWN,
          'Non-FDI R&D project': NOT_KNOWN,
          'New-to-world tech': NOT_KNOWN,
          'Account tier': 'Tier A - Strategic Account',
          'New GHQ/EHQ': NOT_KNOWN,
          'Export revenue': NOT_KNOWN,
        },
      })
    })

    it('should render the FDI table correctly', () => {
      assertSummaryTable({
        dataTest: 'project-fdi-table',
        content: {
          'Investment type': 'FDI, Creation of new site or activity',
          'Foreign investor': 'Venus Ltd',
          'Foreign country': 'United Kingdom',
          'UK company': NOT_KNOWN,
          'Foreign equity investment': NOT_KNOWN,
          'Investor retains 10% voting power': 'No',
          'Number of new jobs': NOT_KNOWN,
          'Number of safeguarded jobs': NOT_KNOWN,
        },
      })
    })

    it('should render the landing table correctly', () => {
      assertSummaryTable({
        dataTest: 'project-landing-table',
        content: {
          'UK company': NOT_KNOWN,
          'Companies House number': NOT_KNOWN,
          'Registered address': NOT_KNOWN,
          'Actual land date': NOT_KNOWN,
        },
      })
    })
  })

  context('When viewing a project with all evaluation fields set', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.evaluation(
          fixtures.investment.investmentWithEvaluation.id
        )
      )
    })

    it('should render the value table correctly', () => {
      assertSummaryTable({
        dataTest: 'project-value-table',
        content: {
          'Primary sector': 'Renewable Energy : Wind : Onshore',
          'Total investment': '£1,000,000',
          'Number of new jobs': '20 new jobs',
          'Average salary': 'Below £25,000',
          'R&D budget': R_AND_D_TRUE,
          'Non-FDI R&D project': 'Find project',
          'New-to-world tech': NEW_TECH_TRUE,
          'Account tier': 'Tier A - Strategic Account',
          'New GHQ/EHQ': 'Yes',
          'Export revenue': EXPORT_REVENUE_TRUE,
        },
      })
    })

    it('should render the FDI table correctly', () => {
      assertSummaryTable({
        dataTest: 'project-fdi-table',
        content: {
          'Investment type': 'FDI, Creation of new site or activity',
          'Foreign investor': 'Venus Ltd',
          'Foreign country': 'United Kingdom',
          'UK company': 'Mercury Ltd',
          'Foreign equity investment': '£200,000',
          'Investor retains 10% voting power': 'Yes',
          'Number of new jobs': '20 new jobs',
          'Number of safeguarded jobs': '11234 safeguarded jobs',
        },
      })
    })

    it('should render the landing table correctly', () => {
      assertSummaryTable({
        dataTest: 'project-landing-table',
        content: {
          'UK company': 'Mercury Ltd',
          'Companies House number': '99919',
          'Registered address':
            '82 Ramsgate RdWillingtonNE28 5JBUnited Kingdom',
          'Actual land date': '22 August 2023',
        },
      })
    })
  })

  context(
    'When viewing a project with the evaluation fields set to the alternate values',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.investments.projects.evaluation(
            fixtures.investment.investmentWithAlternateEvaluation.id
          )
        )
      })

      it('should render the value table correctly', () => {
        assertSummaryTable({
          dataTest: 'project-value-table',
          content: {
            'Primary sector': 'Renewable Energy : Wind : Onshore',
            'Total investment': '£1,000,000',
            'Number of new jobs': '20 new jobs',
            'Average salary': 'Below £25,000',
            'R&D budget': R_AND_D_FALSE,
            'Non-FDI R&D project': NOT_KNOWN,
            'New-to-world tech': NEW_TECH_FALSE,
            'Account tier': 'Tier A - Strategic Account',
            'New GHQ/EHQ': 'No',
            'Export revenue': EXPORT_REVENUE_FALSE,
          },
        })
      })
    }
  )
})
