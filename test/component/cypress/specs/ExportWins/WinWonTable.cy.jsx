import React from 'react'

import { WinsWonTable } from '../../../../../src/client/modules/ExportWins/Status/WinsWonTable'
import { sumExportValues } from '../../../../../src/client/modules/ExportWins/Status/utils'
import { assertGovReactTable } from '../../../../functional/cypress/support/assertions'
import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import { formatMediumDate } from '../../../../../src/client/utils/date'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

const exportWinToRow = (exportWin) => [
  exportWin.company.name,
  exportWin.country.name,
  currencyGBP(sumExportValues(exportWin)),
  formatMediumDate(exportWin.date),
  formatMediumDate(exportWin.customer_response.responded_on),
  'View details',
]

describe('WinsWonTable', () => {
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
        total_expected_export_value: 1000000,
        total_expected_non_export_value: 2000000,
        total_expected_odi_value: 3000000,
        date: '1111-11-11',
        customer_response: {
          responded_on: '1212-12-12',
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
        total_expected_export_value: 4000000,
        total_expected_non_export_value: 5000000,
        total_expected_odi_value: 6000000,
        date: '0101-01-01',
        customer_response: {
          responded_on: '0202-02-02',
        },
      },
      exportWinsFaker(),
    ]

    const Provider = createTestProvider({
      'Export Wins': () => Promise.resolve(wins),
      Company: () => Promise.resolve({ id: 123 }),
      TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
    })

    cy.mount(
      <Provider>
        <WinsWonTable exportWins={EXPORT_WINS} />
      </Provider>
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
