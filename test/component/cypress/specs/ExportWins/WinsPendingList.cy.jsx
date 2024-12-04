import React from 'react'

import { WinsPendingList } from '../../../../../src/client/modules/ExportWins/Status/WinsPendingList'
import { exportWinsData } from './export-wins-data'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

describe('WinsPendingList', () => {
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
            id: 123,
          },
        ],
        country: {
          name: 'USA',
        },
        date: '2023-05-01',
        modified_on: '2024-11-07T10:41:45.425717Z',
        first_sent: '2024-11-07T10:41:45.519419Z',
        last_sent: '2024-11-27T02:00:38.537176Z',
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
        <WinsPendingList exportWins={wins} />
      </Provider>
    )

    cy.get('[data-test="metadata-item"]').as('metadataItems')

    cy.get('@metadataItems')
      .eq(0)
      .should('have.text', 'Contact name: David Test')
      .find('a')
      .should(
        'have.attr',
        'href',
        urls.contacts.details(wins[0].company_contacts[0].id)
      )
    cy.get('@metadataItems').eq(1).should('have.text', 'Total value: £6,000')
    cy.get('@metadataItems').eq(2).should('have.text', 'Date won: May 2023')
    cy.get('@metadataItems')
      .eq(3)
      .should('have.text', 'Date modified: 7 Nov 2024')
    cy.get('@metadataItems')
      .eq(4)
      .should('have.text', 'First sent: 7 Nov 2024, 10:41am')
    cy.get('@metadataItems')
      .eq(5)
      .should('have.text', 'Last sent: 27 Nov 2024, 2:00am')
  })

  it('should conditionally render tags', () => {
    const createProvider = (exportWins) =>
      createTestProvider({
        'Export Wins': () => Promise.resolve(exportWins),
        Company: () => Promise.resolve({ id: 123 }),
        TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
      })

    exportWinsData.forEach(
      ({ exportWins, currentAdviserId, shouldRenderTag, role }) => {
        const Provider = createProvider(exportWins)
        cy.mount(
          <Provider>
            <WinsPendingList
              exportWins={exportWins}
              currentAdviserId={currentAdviserId}
            />
          </Provider>
        )

        const assertion = shouldRenderTag ? 'exist' : 'not.exist'
        cy.get('[data-test="collection-item-tags"]').should(assertion)
        if (assertion === 'exist') {
          cy.get('[data-test="collection-item-tag"]').should('have.text', role)
        }
      }
    )
  })
})
