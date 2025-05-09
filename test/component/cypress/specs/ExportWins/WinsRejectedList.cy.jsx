import React from 'react'
import { pick } from 'lodash'

import { WinsRejectedList } from '../../../../../src/client/modules/ExportWins/Status/WinsRejectedList'
import { sumExportValues } from '../../../../../src/client/modules/ExportWins/Status/utils'
import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import {
  DATE_FORMAT_MEDIUM,
  formatDate,
} from '../../../../../src/client/utils/date-utils'
import { exportWinsData } from './export-wins-data'
import { createTestProvider } from '../provider'
import urls from '../../../../../src/lib/urls'

describe('WinsRejectedList', () => {
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
        <WinsRejectedList exportWins={exportWinsList} />
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

      cy.get('[data-test="collection-item-subheading"] a')
        .should('have.text', exportWin.company.name)
        .and(
          'have.attr',
          'href',
          urls.companies.overview.index(exportWinsList[0].company.id)
        )

      const itemLabels = '[data-test="metadata-label"]'
      cy.get(itemLabels).should('have.length', 4)

      cy.get(itemLabels).eq(0).should('have.text', `Contact name:`)

      cy.get(itemLabels).eq(1).should('have.text', `Total value:`)

      cy.get(itemLabels).eq(2).should('have.text', 'Date won:')

      cy.get(itemLabels).eq(3).should('have.text', `Date modified:`)

      const itemValues = '[data-test="metadata-value"]'
      cy.get(itemValues).should('have.length', 4)

      cy.get(itemValues)
        .eq(0)
        .should('have.text', `${exportWin.company_contacts[0].name}`)

      cy.get(itemValues)
        .eq(1)
        .should(
          'have.text',
          `${currencyGBP(
            sumExportValues(
              pick(exportWin, [
                'total_expected_export_value',
                'total_expected_non_export_value',
                'total_expected_odi_value',
              ])
            )
          )}`
        )

      cy.get(itemValues).eq(2).should('have.text', 'May 2023')

      cy.get(itemValues)
        .eq(3)
        .should(
          'have.text',
          `${formatDate(exportWin.modified_on, DATE_FORMAT_MEDIUM)}`
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
            <WinsRejectedList
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
        <WinsRejectedList exportWins={exportWinsList} />
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

      cy.get('[data-test="collection-item-subheading"]').should(
        'have.text',
        exportWin.company_name
      )
      cy.get('[data-test="collection-item-subheading"] a').should('not.exist')
    })
  })
})
