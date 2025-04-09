import { capitalize } from 'lodash'

import urls from '../../../../../src/lib/urls'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import {
  formatDate,
  DATE_FORMAT_MONTH_YEAR,
} from '../../../../../src/client/utils/date-utils'
import fixtures from '../../fixtures'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
  assertUrl,
} = require('../../support/assertions')

describe('Export Project Details summary ', () => {
  const exportProjectDetails = fixtures.export.exportProjectDetails

  context('when summary table renders', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportProjectDetails.id}`, {
        body: exportProjectDetails,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportProjectDetails.id}/details`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.exportPipeline.index(),
        [exportProjectDetails.title]: null,
      })
    })

    it('shoud render a company link and page heading', () => {
      cy.get('[data-test=export-company-link]')
        .should('have.text', exportProjectDetails.company.name.toUpperCase())
        .should(
          'have.attr',
          'href',
          `/companies/${exportProjectDetails.company.id}`
        )

      cy.get('[data-test="heading"]').should(
        'have.text',
        exportProjectDetails.title
      )
    })

    it('should display the "Export" details summary table', () => {
      const estimatedExportValue = `${
        exportProjectDetails.estimated_export_value_years?.name
      } / ${currencyGBP(exportProjectDetails.estimated_export_value_amount)}`

      const estimatedWinDate = formatDate(
        exportProjectDetails.estimated_win_date,
        DATE_FORMAT_MONTH_YEAR
      )
      assertKeyValueTable('bodyMainContent', {
        'Export title': exportProjectDetails.title,
        Owner: exportProjectDetails.owner.name,
        'Team members': exportProjectDetails.team_members
          .map((obj) => obj.name)
          .join(''),
        'Total estimated export value': estimatedExportValue,
        'Estimated date for win': estimatedWinDate,
        Status: capitalize(exportProjectDetails.status),
        'Export potential': capitalize(exportProjectDetails.export_potential),
        Destination: exportProjectDetails.destination_country.name,
        'Main sector': exportProjectDetails.sector.name,
        'Company contacts': exportProjectDetails.contacts
          .map((obj) => obj.name)
          .join(''),
        'Exporter experience': exportProjectDetails.exporter_experience.name,
        Notes: 'Not set',
      })
    })
  })

  context('when the form edit button is clicked', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportProjectDetails.id}`, {
        body: exportProjectDetails,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportProjectDetails.id}/details`)
    })
    it('the form should redirect to the edit page', () => {
      cy.get('[data-test="edit-export-details-button"]').click()
      assertUrl(urls.exportPipeline.edit(exportProjectDetails.id))
    })
  })

  context('when the form delete button is clicked', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportProjectDetails.id}`, {
        body: exportProjectDetails,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportProjectDetails.id}/details`)
    })
    it('the form should redirect to the delete page', () => {
      cy.get('[data-test="delete-export-details-button"]').click()
      assertUrl(urls.exportPipeline.delete(exportProjectDetails.id))
    })
  })
})
