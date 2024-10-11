import React from 'react'
import { pick } from 'lodash'

import { WinsConfirmedList } from '../../../../../src/client/modules/ExportWins/Status/WinsConfirmedList'
import { sumExportValues } from '../../../../../src/client/modules/ExportWins/Status/utils'
import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import { exportWinsListData } from './export-wins-list-data'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

describe('WinsConfirmedList', () => {
  const exportWin = {
    id: '111',
    company: {
      id: '222',
      name: 'Foo Ltd',
    },
    name_of_export: 'Rolls Reese',
    company_contacts: [
      {
        name: 'David Test',
        id: '333',
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
  }

  it('should render a list of confirmed export wins', () => {
    const exportWinsList = [exportWin, exportWinsFaker(), exportWinsFaker()]

    const Provider = createTestProvider({
      'Export Wins': () => Promise.resolve(exportWinsList),
      Company: () => Promise.resolve({ id: '222' }),
      TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
    })

    cy.mount(
      <Provider>
        <WinsConfirmedList exportWins={exportWinsList} currentAdviserId="888" />
      </Provider>
    )

    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstItem')

    cy.get('@collectionItems').should('have.length', 3)

    cy.get('@firstItem').within(() => {
      cy.get('h3 a')
        .should('have.text', 'Rolls Reese to USA')
        .and(
          'have.attr',
          'href',
          urls.companies.exportWins.editSummary(
            exportWinsList[0].company.id,
            exportWinsList[0].id
          )
        )

      cy.get('h4 a')
        .should('have.text', 'Foo Ltd')
        .and(
          'have.attr',
          'href',
          urls.companies.overview.index(exportWinsList[0].company.id)
        )

      const items = '[data-test="metadata-item"]'
      cy.get(items).should('have.length', 4)
      cy.get(items).eq(0).should('have.text', 'Contact name: David Test')
      cy.get(items)
        .eq(1)
        .should(
          'have.text',
          `Total value: ${currencyGBP(
            sumExportValues(
              pick(exportWin, [
                'total_expected_export_value',
                'total_expected_non_export_value',
                'total_expected_odi_value',
              ])
            )
          )}`
        )
      cy.get(items).eq(2).should('have.text', 'Date won: 1 May 2023')
      cy.get(items).eq(3).should('have.text', 'Date responded: 18 Apr 2024')
    })
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
            <WinsConfirmedList
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
