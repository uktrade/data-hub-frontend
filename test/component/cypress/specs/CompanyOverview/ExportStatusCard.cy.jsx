import React from 'react'

import { assertSummaryTable } from '../../../../functional/cypress/support/assertions'
import {
  companyGlobalUltimateAllDetails,
  companyNoDetails,
} from '../../../../functional/cypress/fakers/companies'
import { ExportStatusDetails } from '../../../../../src/apps/companies/apps/company-overview/overview-table-cards/ExportStatusCard'

describe('AccountManagementCard', () => {
  const Component = (props) => <ExportStatusDetails {...props} />
  context('When the company has no export details set', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyNoDetails} />)
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'exportStatusContainer',
        content: {
          'Export potential': 'Unavailable',
          'Export sub-segment': 'Not set',
          'Currently exporting to': 'Not set',
          'Future countries of interest': 'Not set',
          'Last export win': 'No export wins recorded',
          'Total exports won': '0',
        },
      })
    })
  })

  context('When the company has export details set', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyGlobalUltimateAllDetails} />)
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'exportStatusContainer',
        content: {
          'Export potential': 'Unavailable',
          'Export sub-segment':
            companyGlobalUltimateAllDetails.exportSubSegment +
            companyGlobalUltimateAllDetails.exportSubSegment,
          'Currently exporting to': 'Not set',
          'Future countries of interest': 'Not set',
          'Last export win': 'No export wins recorded',
          'Total exports won': '0',
        },
      })
    })
  })
})
