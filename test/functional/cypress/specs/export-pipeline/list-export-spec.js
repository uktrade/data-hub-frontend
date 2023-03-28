import { exportFaker, exportListFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

const assertExportPotentialTag = (element, text) =>
  cy.get(element).find('strong').eq(0).should('have.text', text)

const assertStatusTag = (element, text) =>
  cy.get(element).find('strong').eq(1).should('have.text', text)

const assertCompanyName = (element, text) => {
  cy.get(element).find('h2').should('have.text', text)
}

const assertDestination = (element, text) => {
  cy.get(element).find('dd').eq(0).should('have.text', text)
}

const assertEstimatedExportAmount = (element, text) => {
  cy.get(element).find('dd').eq(1).should('have.text', text)
}

const assertEstimatedWinDate = (element, text) => {
  cy.get(element).find('dd').eq(2).should('have.text', text)
}

const assertSector = (element, text) => {
  cy.get(element).find('dd').eq(3).should('have.text', text)
}

const assertOwner = (element, text) => {
  cy.get(element).find('dd').eq(4).should('have.text', text)
}
const assertCreatedOnDate = (element, text) => {
  cy.get(element).find('dd').eq(5).should('have.text', text)
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
    destination_country: {
      name: 'Portugal',
    },
    estimated_export_value_amount: '957485',
    estimated_export_value_years: {
      name: '5 years',
    },
    estimated_win_date: '2023-10-08T11:54:19Z',
    sector: {
      name: 'Energy',
    },
    owner: {
      name: 'Benjamin Graham',
    },
    created_on: '2023-03-20T09:19:39.998239Z',
  })
  const won = exportFaker({
    id: 2,
    export_potential: 'medium',
    status: 'won',
    company: {
      name: 'Alphabet',
    },
    title: 'Export Alphabet',
    destination_country: {
      name: 'Italy',
    },
    estimated_export_value_amount: '141851',
    estimated_export_value_years: {
      name: 'Not yet known',
    },
    estimated_win_date: '2023-05-08T11:54:19Z',
    sector: {
      name: 'Mass Transport',
    },
    owner: {
      name: 'Warren Buffet',
    },
    created_on: '2023-02-19T09:29:39.998239Z',
  })
  const inactive = exportFaker({
    id: 3,
    export_potential: 'low',
    status: 'inactive',
    company: {
      name: 'Meta',
    },
    title: 'Export Meta',
    destination_country: {
      name: 'Greece',
    },
    estimated_export_value_amount: '858211',
    estimated_export_value_years: {
      name: '4 years',
    },
    estimated_win_date: '2023-02-08T11:54:19Z',
    sector: {
      name: 'Security : Cyber Security',
    },
    owner: {
      name: 'Peter Lynch',
    },
    created_on: '2023-01-18T09:39:39.998239Z',
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

  it('should display a destination', () => {
    assertDestination('@firstListItem', 'Portugal')
    assertDestination('@secondListItem', 'Italy')
    assertDestination('@thirdListItem', 'Greece')
  })

  it('should display the total estimated export amount', () => {
    assertEstimatedExportAmount('@firstListItem', '£957,485 (5 years)')
    assertEstimatedExportAmount('@secondListItem', '£141,851 (Not yet known)')
    assertEstimatedExportAmount('@thirdListItem', '£858,211 (4 years)')
  })

  it('should display an estimated win date', () => {
    assertEstimatedWinDate('@firstListItem', 'October 2023')
    assertEstimatedWinDate('@secondListItem', 'May 2023')
    assertEstimatedWinDate('@thirdListItem', 'February 2023')
  })

  it('should display a sector', () => {
    assertSector('@firstListItem', 'Energy')
    assertSector('@secondListItem', 'Mass Transport')
    assertSector('@thirdListItem', 'Security : Cyber Security')
  })

  it('should display an owner', () => {
    assertOwner('@firstListItem', 'Benjamin Graham')
    assertOwner('@secondListItem', 'Warren Buffet')
    assertOwner('@thirdListItem', 'Peter Lynch')
  })

  it('should display a created on date', () => {
    assertCreatedOnDate('@firstListItem', '20 Mar 2023, 9:19am')
    assertCreatedOnDate('@secondListItem', '19 Feb 2023, 9:29am')
    assertCreatedOnDate('@thirdListItem', '18 Jan 2023, 9:39am')
  })

  it('should show and hide the content on toggle', () => {
    cy.get('[data-test="toggle-section-button"]').contains('Show').click()
    cy.get('[data-test="export-details"]').should('be.visible')
    cy.get('[data-test="toggle-section-button"]').contains('Hide').click()
    cy.get('[data-test="export-details"]').should('not.be.visible')
  })
})
