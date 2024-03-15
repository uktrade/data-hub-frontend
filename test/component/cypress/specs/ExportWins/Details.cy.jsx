import React from 'react'

import {
  assertBreadcrumbs,
  assertLocalHeader,
  assertLink,
} from '../../../../functional/cypress/support/assertions'
import { WIN_STATUS } from '../../../../../src/client/modules/ExportWins/Status/constants'
import Details from '../../../../../src/client/modules/ExportWins/Details'
import urls from '../../../../../src/lib/urls'
import DataHubProvider from '../provider'

const insertAfter = (o, n, oo) => {
  const entries = Object.entries(o)
  return Object.fromEntries(
    entries.toSpliced(
      entries.findIndex(([k]) => k === n) + 1,
      null,
      ...Object.entries(oo)
    )
  )
}

const EXPORT_WIN = {
  id: 'export-win-id',
  name_of_export: 'Rubber chicken',
  lead_officer: {
    name: 'Leo Jacobs',
  },
  country: {
    name: 'Australia',
  },
  total_expected_export_value: 2528571,
  date: '2024-03-26T14:29:01.521Z',
  goods_vs_services: {
    name: 'Services',
  },
  is_personally_confirmed: false,
  customer_response: {
    agree_with_win: false,
  },
  breakdowns: [
    {
      type: {
        name: 'Export',
      },
      value: 123456,
      year: 3,
    },
  ],
  customer_response: {
    agree_with_win: WIN_STATUS.SENT, // the default
    our_support: null,
  },
}

const EXPECTED_ROWS = {
  'Goods or services': EXPORT_WIN.goods_vs_services.name,
  'Destination country': EXPORT_WIN.country.name,
  'Total value': '£123,456 over 1 year',
  'Date won': '26 Mar 2024',
  'Lead officer name': 'Leo Jacobs',
  'Export win confirmed': 'No',
}

describe('ExportWins/Details', () => {
  const title = `${EXPORT_WIN.name_of_export} to ${EXPORT_WIN.country.name}`

  const Component = ({ exportWinAPIResponse }) => (
    <DataHubProvider
      resetTasks={true}
      tasks={{
        'Export Win': () => exportWinAPIResponse,
        TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
      }}
    >
      <Details match={{ params: { winId: EXPORT_WIN.id } }} />
    </DataHubProvider>
  )

  ;[
    {
      testTitle: 'Confirmed',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        customer_response: {
          agree_with_win: true,
          comments: 'I agree',
          our_support: {
            name: 'Not very much',
          },
        },
      },
      tableRows: insertAfter(
        {
          ...EXPECTED_ROWS,
          'Export win confirmed': 'Yes',
          'What value do you estimate you would have achieved without our support':
            'Not very much',
        },
        'Lead officer name',
        {
          Comments: 'I agree',
        }
      ),
      shouldHaveCustomerFeedbackLink: true,
    },
    {
      testTitle: 'Rejected',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        customer_response: {
          agree_with_win: false,
          comments: 'I disagree',
        },
      },
      tableRows: insertAfter(
        {
          ...EXPECTED_ROWS,
          'Export win confirmed': 'No',
        },
        'Lead officer name',
        {
          Comments: 'I disagree',
        }
      ),
      shouldHaveCustomerFeedbackLink: false,
    },
    {
      testTitle: 'Unconfirmed',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
      },
      tableRows: {
        ...EXPECTED_ROWS,
        'Export win confirmed': 'No',
      },
    },
    {
      testTitle: 'Single Foo breakdown',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Foo' },
            value: 111111,
            year: 1,
          },
        ],
      },
      tableRows: {
        ...EXPECTED_ROWS,
        'Total value': '£111,111 over 1 year',
      },
    },
    {
      testTitle: 'Single Bar breakdown',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Bar' },
            value: 222222,
            year: 1,
          },
        ],
      },
      tableRows: {
        ...EXPECTED_ROWS,
        'Total value': '£222,222 over 1 year',
      },
    },
    {
      testTitle: 'Two Bar breakdowns',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Bar' },
            value: 222222,
            year: 2,
          },
          {
            type: { name: 'Bar' },
            value: 111111,
            year: 2,
          },
        ],
      },
      tableRows: {
        ...EXPECTED_ROWS,
        'Total value': '£333,333 over 1 year',
      },
    },
    {
      testTitle: 'Three Foo breakdowns',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Foo' },
            value: 222222,
            year: 3,
          },
          {
            type: { name: 'Foo' },
            value: 111111,
            year: 3,
          },
          {
            type: { name: 'Foo' },
            value: 333333,
            year: 3,
          },
        ],
      },
      tableRows: {
        ...EXPECTED_ROWS,
        'Total value': '£666,666 over 1 year',
      },
    },
    {
      testTitle: 'Three different 1 year breakdowns',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Foo' },
            value: 222222,
            year: 4,
          },
          {
            type: { name: 'Bar' },
            value: 111111,
            year: 4,
          },
          {
            type: { name: 'Baz' },
            value: 333333,
            year: 4,
          },
        ],
      },
      tableRows: insertAfter(
        {
          ...EXPECTED_ROWS,
          'Total value': '£666,666 over 1 year',
        },
        'Destination country',
        {
          Foo: '£222,222 over 1 year',
          Bar: '£111,111 over 1 year',
          Baz: '£333,333 over 1 year',
        }
      ),
    },
    {
      testTitle: 'Two different breakdowns over 5 years',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Foo' },
            value: 3,
            year: 1,
          },
          {
            type: { name: 'Bar' },
            value: 20,
            year: 5,
          },
        ],
      },
      tableRows: insertAfter(
        {
          ...EXPECTED_ROWS,
          'Total value': '£23 over 5 years',
        },
        'Destination country',
        {
          Foo: '£3 over 1 year',
          Bar: '£20 over 1 year',
        }
      ),
    },
    {
      testTitle: 'Three different breakdowns over 5 years',
      exportWinAPIResponse: {
        ...EXPORT_WIN,
        breakdowns: [
          {
            type: { name: 'Foo' },
            value: 1,
            year: 1,
          },
          {
            type: { name: 'Baz' },
            value: 100,
            year: 2,
          },
          {
            type: { name: 'Bar' },
            value: 10,
            year: 3,
          },
          {
            type: { name: 'Baz' },
            value: 100,
            year: 4,
          },
          {
            type: { name: 'Foo' },
            value: 1,
            year: 3,
          },
          {
            type: { name: 'Baz' },
            value: 100,
            year: 5,
          },
        ],
      },
      tableRows: insertAfter(
        {
          ...EXPECTED_ROWS,
          'Total value': '£312 over 5 years',
        },
        'Destination country',
        {
          Foo: '£2 over 3 years',
          Baz: '£300 over 4 years',
          Bar: '£10 over 1 year',
        }
      ),
    },
  ].forEach(
    ({
      testTitle,
      exportWinAPIResponse,
      tableRows,
      shouldHaveCustomerFeedbackLink,
    }) => {
      it(testTitle, () => {
        const rowEntries = Object.entries(tableRows)
        cy.mount(<Component exportWinAPIResponse={exportWinAPIResponse} />)

        assertBreadcrumbs({
          Home: urls.dashboard.index(),
          'Export wins': urls.companies.exportWins.index(),
          [title]: null,
        })

        assertLocalHeader(title)

        // TODO: Abstract it away into assertSummaryTableStrict
        cy.get('main table tr')
          .as('rows')
          .should('have.length', rowEntries.length)

        rowEntries.forEach(([key, val], i) => {
          cy.get('@rows')
            .eq(i)
            .within(() => {
              cy.get('th').should('have.length', 1).should('have.text', key)
              cy.get('td').should('have.length', 1).should('have.text', val)
            })
        })

        assertLink('export-wins-link', '/exportwins')

        if (shouldHaveCustomerFeedbackLink) {
          cy.contains('a', 'View customer feedback').should(
            'have.attr',
            'href',
            `/exportwins/${EXPORT_WIN.id}/customer-feedback`
          )
        } else {
          cy.contains('View customer feedback').should('not.exist')
        }
      })
    }
  )

  context(
    'When the "Resend export win" button is hidden/shown on the details page',
    () => {
      it('should not be visible when the status of the export win is "rejected"', () => {
        cy.mount(
          <Component
            exportWinAPIResponse={{
              ...EXPORT_WIN,
              customer_response: {
                agree_with_win: WIN_STATUS.REJECTED,
              },
            }}
          />
        )
        cy.get('[data-test="resend-export-win"]').should('not.exist')
      })
      it('should be visible when the status of the export win is "sent"', () => {
        cy.mount(
          <Component
            exportWinAPIResponse={{
              ...EXPORT_WIN,
              customer_response: {
                agree_with_win: WIN_STATUS.SENT,
              },
            }}
          />
        )
        cy.get('[data-test="resend-export-win"]').should('exist')
      })
      it('should not be visible when the status of the export win is "won"', () => {
        cy.mount(
          <Component
            exportWinAPIResponse={{
              ...EXPORT_WIN,
              customer_response: {
                agree_with_win: WIN_STATUS.WON,
                our_support: {
                  name: 'A fortune',
                },
              },
            }}
          />
        )
        cy.get('[data-test="resend-export-win"]').should('not.exist')
      })
    }
  )
})
