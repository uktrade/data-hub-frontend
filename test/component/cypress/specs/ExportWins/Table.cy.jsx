import React from 'react'

import DataHubProvider from '../provider'
import { WinsWonTable } from '../../../../../src/client/modules/ExportWins/Status/WinsWonTable'
import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import { formatMediumDate } from '../../../../../src/client/utils/date'
import { assertGovReactTable } from '../../../../functional/cypress/support/assertions'
import urls from '../../../../../src/lib/urls'

const exportWinToRow = (exportWin) => [
  exportWin.company.name,
  exportWin.country.name,
  currencyGBP(exportWin.total_expected_export_value),
  formatMediumDate(exportWin.date),
  formatMediumDate(exportWin.customer_response.created_on),
  'View details',
]

describe('Export wins table', () => {
  it('should render Export wins table', () => {
    const EXPORT_WINS = [
      {
        company: {
          name: 'Company 1',
          id: 'company-1',
        },
        country: {
          name: 'Slovakia',
        },
        total_expected_export_value: 1111111,
        date: '1111-11-11',
        customer_response: {
          created_on: '1212-12-12',
        },
      },
      {
        company: {
          name: 'Company 2',
          id: 'company-2',
        },
        country: {
          name: 'Czech Republic',
        },
        total_expected_export_value: 222222,
        date: '0101-01-01',
        customer_response: {
          created_on: '0202-02-02',
        },
      },
      exportWinsFaker(),
    ]

    cy.mount(
      <DataHubProvider>
        <WinsWonTable exportWins={EXPORT_WINS} />
      </DataHubProvider>
    )

    assertGovReactTable({
      element: 'table',
      headings: [
        'UK Company',
        'Destination',
        'Export amount',
        'Date won',
        'Date responded',
        'Details',
      ],
      rows: EXPORT_WINS.map(exportWinToRow),
    })

    EXPORT_WINS.forEach((exportWin, i) =>
      cy
        .get(`tbody tr`)
        .eq(i)
        .contains(exportWin.company.name)
        .should(
          'have.attr',
          'href',
          urls.companies.overview.index(exportWin.company.id)
        )
    )

    // TODO: Assert "View details" link in the last column
  })
})
