import urls from '../../../../../src/lib/urls'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
} = require('../../support/assertions')

const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')
// const exportId = exportPipelineDetails.id

describe('Export Details', () => {
  const exportItem = exportItems.results[0]
  context('when summary table renders', () => {
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
})
