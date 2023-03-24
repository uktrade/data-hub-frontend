import { exportFaker, exportListFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

const assertExportPotentialTag = (element, text) =>
  cy.get(element).find('strong').eq(0).should('have.text', text)

const assertStatusTag = (element, text) =>
  cy.get(element).find('strong').eq(1).should('have.text', text)

describe('Export pipeline list', () => {
  const active = exportFaker({
    export_potential: 'high',
    status: 'active',
  })
  const won = exportFaker({
    export_potential: 'medium',
    status: 'won',
  })
  const inactive = exportFaker({
    export_potential: 'low',
    status: 'inactive',
  })

  const otherExports = exportListFaker(7)

  const exportList = [active, won, inactive, ...otherExports]

  before(() => {
    cy.setUserFeatures(['export-pipeline'])
    cy.intercept('GET', '/api-proxy/v4/export', {
      body: {
        count: exportList.length,
        results: exportList,
      },
    }).as('apiRequest')
    cy.visit(urls.exportPipeline.index())
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="export-list"]').as('exportList')
    cy.get('[data-test="export-item"]').as('exportItems')
    cy.get('@exportItems').eq(0).as('firstListItem')
    cy.get('@exportItems').eq(1).as('secondListItem')
    cy.get('@exportItems').eq(2).as('thirdListItem')
  })

  it('should display a list of exports', () => {
    cy.get('[data-test="export-list"]').should('have.length', 1)
    cy.get('[data-test="export-item"]').should('have.length', exportList.length)
  })

  it('should display export potential tags', () => {
    assertExportPotentialTag('@firstListItem', 'HIGH POTENTIAL')
    assertExportPotentialTag('@secondListItem', 'MEDIUM POTENTIAL')
    assertExportPotentialTag('@thirdListItem', 'LOW POTENTIAL')
  })

  it('should display an export active tag', () => {
    assertStatusTag('@firstListItem', 'ACTIVE')
    assertStatusTag('@secondListItem', 'WON')
    assertStatusTag('@thirdListItem', 'INACTIVE')
  })
})
