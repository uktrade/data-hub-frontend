import { exportFaker, exportListFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

const assertExportPotentialTag = (element, text) =>
  cy.get(element).find('strong').eq(0).should('have.text', text)

const assertStatusTag = (element, text) =>
  cy.get(element).find('strong').eq(1).should('have.text', text)

const assertCompanyName = (element, text) => {
  cy.get(element).find('h2').should('have.text', text)
}

const assertTitleLink = (element, href, text) => {
  cy.get(element)
    .find('a')
    .should('have.attr', 'href', href)
    .should('have.text', text)
}

describe('Export pipeline list', () => {
  const active = exportFaker({
    id: 1,
    export_potential: 'high',
    status: 'active',
    company: {
      name: 'Coca-Cola',
    },
    title: 'Export Coca-Cola',
  })
  const won = exportFaker({
    id: 2,
    export_potential: 'medium',
    status: 'won',
    company: {
      name: 'Alphabet',
    },
    title: 'Export Alphabet',
  })
  const inactive = exportFaker({
    id: 3,
    export_potential: 'low',
    status: 'inactive',
    company: {
      name: 'Meta',
    },
    title: 'Export Meta',
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

  it('should display a company name header', () => {
    assertCompanyName('@firstListItem', 'Coca-Cola')
    assertCompanyName('@secondListItem', 'Alphabet')
    assertCompanyName('@thirdListItem', 'Meta')
  })

  it('should display a link to the export', () => {
    assertTitleLink('@firstListItem', '/export/1/details', 'Export Coca-Cola')
    assertTitleLink('@secondListItem', '/export/2/details', 'Export Alphabet')
    assertTitleLink('@thirdListItem', '/export/3/details', 'Export Meta')
  })
})
