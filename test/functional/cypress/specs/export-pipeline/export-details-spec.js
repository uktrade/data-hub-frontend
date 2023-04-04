import urls from '../../../../../src/lib/urls'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
  assertUrl,
} = require('../../support/assertions')

const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')

describe('Export Details summary ', () => {
  const exportItem = exportItems.results[0]
  context.only('when summary table renders', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportItem.id}/details`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        [exportItem.title]: null,
      })
    })

    it('should display the "Export" details summary table', () => {
      assertKeyValueTable('bodyMainContent', {
        'Export Title': exportItem.title,
        Owner: exportItem.owner.name,
        'Team Members': exportItem.team_members,
        'Total estimated export value':
          exportItem.estimated_export_value_amount,
        'Estimated date for Win': exportItem.estimated_win_date,
        Status: exportItem.status,
        'Export potential': exportItem.export_potential,
        Destination: exportItem.destination_country,
        'Main sector': exportItem.sector,
        'Exporter experience': exportItem.exporter_experience,
        'Company contacts': exportItem.contacts,
        Notes: exportItem.notes,
      })
    })
  })

  context('when the form edit button is clicked', () => {
    const exportDetailsUrl = `/export/${exportItem.id}/details`
    it('the form should redirect to the edit page', () => {
      cy.get('[data-test="edit-export-details-button"]').click()
      assertUrl(urls.exportPipeline.edit())
    })
  })

  context('when the form delete button is clicked', () => {
    it('the form should redirect to the delete page', () => {
      cy.get('[data-test="delete-button"]').click()
      assertUrl(urls.exportPipeline.delete())
    })
  })
})
