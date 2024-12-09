import React from 'react'
import { pick } from 'lodash'

import { WinsConfirmedList } from '../../../../../src/client/modules/ExportWins/Status/WinsConfirmedList'
import { sumExportValues } from '../../../../../src/client/modules/ExportWins/Status/utils'
import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import { formatDate } from '../../../../../src/client/utils/date-utils'
import { exportWinsData } from './export-wins-data'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

describe('WinsConfirmedList', () => {
  it('should render a list of confirmed export wins', () => {
    const exportWin = exportWinsFaker()
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
        .should(
          'have.text',
          `${exportWin.name_of_export} to ${exportWin.country.name}`
        )
        .and(
          'have.attr',
          'href',
          urls.companies.exportWins.editSummary(
            exportWinsList[0].company.id,
            exportWinsList[0].id
          )
        )

      cy.get('h4 a')
        .should('have.text', exportWin.company.name)
        .and(
          'have.attr',
          'href',
          urls.companies.overview.index(exportWinsList[0].company.id)
        )

      const items = '[data-test="metadata-item"]'
      cy.get(items).should('have.length', 4)
      cy.get(items)
        .eq(0)
        .should(
          'have.text',
          `Contact name: ${exportWin.company_contacts[0].name}`
        )
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
      cy.get(items).eq(2).should('have.text', 'Date won: May 2023')
      cy.get(items)
        .eq(3)
        .should(
          'have.text',
          `Date responded: ${formatDate(exportWin.customer_response.responded_on)}`
        )
    })
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
            <WinsConfirmedList
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
