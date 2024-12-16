import { capitalize } from 'lodash'

import urls from '../../../../../src/lib/urls'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import {
  formatDate,
  DATE_FORMAT_MONTH_YEAR,
} from '../../../../../src/client/utils/date-utils'
import { exportFaker } from '../../fakers/export'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
  assertUrl,
} = require('../../support/assertions')

describe('Export Details summary ', () => {
  const exportItem = exportFaker()
  context('when summary table renders', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportItem.id}/details`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.exportPipeline.index(),
        [exportItem.title]: null,
      })
    })

    it('should display the "Export" details summary table', () => {
      const estimatedExportValue = `${
        exportItem.estimated_export_value_years?.name
      } / ${currencyGBP(exportItem.estimated_export_value_amount)}`

      const estimatedWinDate = formatDate(
        exportItem.estimated_win_date,
        DATE_FORMAT_MONTH_YEAR
      )
      assertKeyValueTable('bodyMainContent', {
        'Export title': exportItem.title,
        Owner: exportItem.owner.name,
        'Team members': exportItem.team_members.map((obj) => obj.name).join(''),
        'Total estimated export value': estimatedExportValue,
        'Estimated date for win': estimatedWinDate,
        Status: capitalize(exportItem.status),
        'Export potential': capitalize(exportItem.export_potential),
        Destination: exportItem.destination_country.name,
        'Main sector': exportItem.sector.name,
        'Company contacts': exportItem.contacts.map((obj) => obj.name).join(''),
        'Exporter experience': exportItem.exporter_experience.name,
        Notes: exportItem.notes,
      })
    })
  })

  context('when the form edit button is clicked', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportItem.id}/details`)
    })
    it('the form should redirect to the edit page', () => {
      cy.get('[data-test="edit-export-details-button"]').click()
      assertUrl(urls.exportPipeline.edit(exportItem.id))
    })
  })

  context('when the form delete button is clicked', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportItem.id}/details`)
    })
    it('the form should redirect to the delete page', () => {
      cy.get('[data-test="delete-export-details-button"]').click()
      assertUrl(urls.exportPipeline.delete(exportItem.id))
    })
  })
})
