import React from 'react'

import { WinsSentList } from '../../../../../src/client/modules/ExportWins/Status/WinsSentList'
import { createTestProvider } from '../provider'

describe('WinsSentList', () => {
  it('should render Export wins list', () => {
    const wins = [
      {
        id: '123',
        company: {
          id: '456',
          name: 'Foo Ltd',
        },
        name_of_export: 'Rolls Reese',
        company_contacts: [
          {
            name: 'David Test',
          },
        ],
        country: {
          name: 'USA',
        },
        date: '2023-05-01',
        customer_response: {
          responded_on: '2024-04-18T12:15:49.361611Z',
        },
        total_expected_export_value: 1000,
        total_expected_non_export_value: 2000,
        total_expected_odi_value: 3000,
      },
    ]
    const Provider = createTestProvider({
      'Export Wins': () => Promise.resolve(wins),
      Company: () => Promise.resolve({ id: 123 }),
      TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
    })

    cy.mount(
      <Provider>
        <WinsSentList exportWins={wins} />
      </Provider>
    )

    cy.get('[data-test="metadata-item"]')
      .eq(1)
      .should('have.text', 'Total value: £6,000')
  })
})
