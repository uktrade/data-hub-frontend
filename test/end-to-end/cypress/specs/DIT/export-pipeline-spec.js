const fixtures = require('../../fixtures')
const { exportFaker } = require('../../../../functional/cypress/fakers/export')
const { exportPipeline } = require('../../../../../src/lib/urls')
const {
  fill,
  fillTypeahead,
  fillSelect,
} = require('../../../../functional/cypress/support/form-fillers')

describe('Export pipeline', () => {
  const company = fixtures.company.create.defaultCompany(
    'export pipeline testing'
  )
  const contact = fixtures.contact.create(company.pk)
  const newExport = exportFaker({ destination_country: { name: 'Greece' } })
  let createdExportId

  context('Happy path export pipeline item', () => {
    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
    })

    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v4/export').as('createExport')
      cy.intercept(
        'GET',
        '/api-proxy/v4/export?limit=10&page=1&offset=0&archived=false&sortby=created_on%3Adesc'
      ).as('listExport')
    })

    it('should successfully create an export', () => {
      cy.visit(exportPipeline.create(company.pk))
      fill('[data-test=title-input]', newExport.title)
      fillSelect(
        '[data-test=field-estimated_export_value_years]',
        newExport.estimated_export_value_years.id
      )
      fill(
        '[data-test=estimated-export-value-amount-input]',
        newExport.estimated_export_value_amount
      )
      fill('[data-test=estimated_win_date-month]', '03')
      fill('[data-test=estimated_win_date-year]', '2035')
      fillTypeahead(
        '[data-test=field-destination_country]',
        newExport.destination_country.name
      )
      fillTypeahead('[data-test=field-sector]', newExport.sector.name)
      cy.get('[name="status"]').check(newExport.status)
      cy.get('[name="export_potential"]').check(newExport.export_potential)

      fillTypeahead('[data-test=field-contacts]', 'Johnny Cakeman')

      cy.get('[data-test=submit-button]').click()

      cy.wait('@createExport').then(
        ({ response }) => (createdExportId = response.body.id)
      )
    })

    it('should successfully display the new export', () => {
      cy.visit(exportPipeline.index())
      cy.wait('@listExport')
      cy.get(`a[href="${exportPipeline.details(createdExportId)}"]`).should(
        'exist'
      )
    })

    it('should successfully edit an export', () => {
      cy.visit(exportPipeline.edit(createdExportId))
      cy.get('[data-test=title-input]').type('edited title')
      cy.get('[data-test=field-notes]').type('edited notes')
      cy.get('[data-test=submit-button]').click()

      cy.visit(exportPipeline.edit(createdExportId))
    })

    it('should successfully delete an export', () => {
      cy.visit(exportPipeline.delete(createdExportId))
      cy.get('[data-test=submit-button]').click()
    })

    it('should not display the deleted export in the list', () => {
      cy.visit(exportPipeline.index())
      cy.wait('@listExport')
      cy.get(`a[href="${exportPipeline.details(createdExportId)}"]`).should(
        'not.exist'
      )
    })
  })
})
