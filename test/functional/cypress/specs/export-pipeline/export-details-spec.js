import urls from '../../../../../src/lib/urls'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
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
      assertKeyValueTable({
        dataTest: 'exportTitle',
        heading: 'Export Test 123',
        showEditLink: true,
        exportPipeline: {
          'Export Title': 'Export Test 123',
          Owner: 'Test Chloe Wong',
          'Team Members': 'Test Aaron Wilson',
          'Total estimated export value': '12',
          'Estimated date for Win': 'March 2023',
          Status: 'active',
          'Export potential': 'high',
          Destination: 'Afghanistan',
          'Main sector':
            'Automotive : Component Manufacturing : Electronic Components',
          'Exporter experience': 'Never exported',
          'Company contacts': 'Test Chris Hopkins',
          Notes: 'Not set',
        },
      })
    })
  })
  context('when the form edit button is clicked', () => {
    const exportDetailsUrl = `/export/${exportItem.id}/details`
    before(() => {
      cy.visit(exportDetailsUrl)
    })
    it.only('the form should redirect to the edit page', () => {
      cy.get('[data-test="edit-export-details-button"]').click()
      assertUrl(urls.exportPipeline.edit())
    })
  })
  context('when the form delete button is clicked', () => {
    before(() => {
      cy.visit(exportDetailsUrl)
    })
    it('the form should redirect to the delete page', () => {
      cy.get('[data-test="delete-button"]').click()
      assertUrl(urls.exportPipeline.delete())
    })
  })
})
