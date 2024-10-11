import React from 'react'

import { WinsRejectedList } from '../../../../../src/client/modules/ExportWins/Status/WinsRejectedList'
import { exportWinsListData } from './export-wins-list-data'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

describe('WinsRejectedList', () => {
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
            name: 'James Dean',
            id: '345',
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
        <WinsRejectedList exportWins={wins} />
      </Provider>
    )

    cy.get('[data-test="metadata-item"]').as('metadataItems')

    cy.get('@metadataItems')
      .eq(0)
      .should('have.text', 'Contact name: James Dean')
      .find('a')
      .should(
        'have.attr',
        'href',
        urls.contacts.details(wins[0].company_contacts[0].id)
      )

    cy.get('@metadataItems').eq(1).should('have.text', 'Total value: £6,000')
  })
  it('should conditionally render tags', () => {
    const createProvider = (exportWinsList) =>
      createTestProvider({
        'Export Wins': () => Promise.resolve(exportWinsList),
        Company: () => Promise.resolve({ id: 123 }),
        TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
      })

    exportWinsListData.forEach(
      ({ exportWinsList, currentAdviserId, shouldRenderTag, role }) => {
        const Provider = createProvider(exportWinsList)
        cy.mount(
          <Provider>
            <WinsRejectedList
              exportWins={exportWinsList}
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
