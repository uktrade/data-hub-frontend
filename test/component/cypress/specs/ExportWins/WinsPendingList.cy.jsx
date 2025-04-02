import React from 'react'
import { pick } from 'lodash'

import { WinsPendingList } from '../../../../../src/client/modules/ExportWins/Status/WinsPendingList'
import { sumExportValues } from '../../../../../src/client/modules/ExportWins/Status/utils'
import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import {
  formatDate,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'
import { exportWinsData } from './export-wins-data'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

describe('WinsPendingList', () => {
  it('should render Export wins list', () => {
    const exportWin = exportWinsFaker()
    const exportWinsList = [exportWin, exportWinsFaker(), exportWinsFaker()]

    const Provider = createTestProvider({
      'Export Wins': () => Promise.resolve(exportWinsList),
      Company: () => Promise.resolve({ id: 123 }),
      TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
    })

    cy.mount(
      <Provider>
        <WinsPendingList exportWins={exportWinsList} />
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
      cy.get(items).should('have.length', 6)

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
          `Date modified: ${formatDate(exportWin.modified_on, DATE_FORMAT_MEDIUM)}`
        )
      cy.get(items)
        .eq(4)
        .should(
          'have.text',
          `First sent: ${formatDate(exportWin.first_sent, DATE_FORMAT_MEDIUM_WITH_TIME)}`
        )

      cy.get(items)
        .eq(5)
        .should(
          'have.text',
          `Last sent: ${formatDate(exportWin.last_sent, DATE_FORMAT_MEDIUM_WITH_TIME)}`
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

  it('should render heading without Company profile link into Datahub - Legacy Wins', () => {
    const exportWin = {
      ...exportWinsFaker(),
      company: null,
      company_name: 'Legacy Company Ltd',
    }
    const exportWinsList = [exportWin, exportWinsFaker(), exportWinsFaker()]

    const Provider = createTestProvider({
      'Export Wins': () => Promise.resolve(exportWinsList),
      Company: () => Promise.resolve({ id: 123 }),
      TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
    })

    cy.mount(
      <Provider>
        <WinsPendingList exportWins={exportWinsList} />
      </Provider>
    )

    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstItem')

    cy.get('@collectionItems').should('have.length', 3)

    cy.get('@firstItem').within(() => {
      cy.get('h3').should(
        'have.text',
        `${exportWin.name_of_export} to ${exportWin.country.name}`
      )
      cy.get('h3 a').should('not.exist')

      cy.get('h4').should('have.text', exportWin.company_name)
      cy.get('h4 a').should('not.exist')
    })
  })
})
