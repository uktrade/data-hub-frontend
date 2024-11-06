import qs from 'qs'

import { exportFaker, exportListFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

const assertExportPotentialTag = (element, text) =>
  cy.get(element).find('strong').eq(0).should('have.text', text)

const assertStatusTag = (element, text) =>
  cy.get(element).find('strong').eq(1).should('have.text', text)

const assertCompanyName = (element, text) => {
  cy.get(element).find('h3').should('have.text', text)
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

const assertLink = (element, index, href, text) => {
  cy.get(element)
    .find('a')
    .eq(index)
    .should('have.attr', 'href', href)
    .should('have.text', text)
}

describe('Export pipeline list', () => {
  const endpoint = '/api-proxy/v4/export'
  const queryString = qs.stringify({
    limit: 10,
    page: 1,
    offset: 0,
    archived: false,
    sortby: 'created_on:desc',
  })

  context('When the api returns no export items', () => {
    before(() => {
      cy.intercept('GET', `${endpoint}?${queryString}`, {
        body: {
          count: 0,
          results: [],
        },
      }).as('apiRequest')
      cy.visit(urls.exportPipeline.index())
      cy.wait('@apiRequest')
    })

    it('should display the empty results message', () => {
      cy.get('[data-test=no-export-items]').should('exist')
      cy.get('[data-test=export-export]').should('not.exist')
    })
  })

  context('When the api returns export items', () => {
    const active = exportFaker({
      id: 1,
      export_potential: 'high',
      status: 'active',
      company: {
        id: 1,
        name: 'Coca-Cola',
      },
      title: 'Export Coca-Cola',
      destination_country: {
        name: 'Portugal',
      },
      estimated_export_value_amount: '957485',
      estimated_export_value_years: null,
      estimated_win_date: '2023-10-08',
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
        id: 2,
        name: 'Alphabet',
      },
      title: 'Export Alphabet',
      destination_country: {
        name: 'Italy',
      },
      estimated_export_value_amount: null,
      estimated_export_value_years: {
        name: 'Not yet known',
      },
      estimated_win_date: '2023-05-08',
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
        id: 3,
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
      estimated_win_date: '2023-02-08',
      sector: {
        name: 'Security : Cyber Security',
      },
      owner: {
        name: 'Peter Lynch',
      },
      created_on: '2023-01-18T09:39:39.998239Z',
    })
    const archived = exportFaker({
      id: 4,
      archived: true,
      title: 'Archived export',
    })
    const missingMigratedData = exportFaker({
      id: 5,
      export_potential: 'low',
      status: 'inactive',
      company: {
        id: 4,
        name: 'Sony',
      },
      title: 'Missing Migrated Data',
      destination_country: null,
      estimated_export_value_amount: null,
      estimated_export_value_years: null,
      estimated_win_date: null,
      sector: null,
      owner: {
        name: 'Ron Burgundy',
      },
      created_on: '2019-07-19T09:39:39.998239Z',
    })

    const otherExports = exportListFaker(8)
    const exportList = [
      active,
      won,
      inactive,
      archived,
      missingMigratedData,
      ...otherExports,
    ]
    const notArchivedExports = exportList.filter((e) => e.archived == false)

    beforeEach(() => {
      cy.intercept('GET', `${endpoint}?${queryString}`, {
        body: {
          count: notArchivedExports.length,
          results: notArchivedExports,
        },
      }).as('apiRequest')
      cy.visit(urls.exportPipeline.index())
      cy.wait('@apiRequest')
      cy.get('[data-test="export-item"]').as('exportItems')
      cy.get('@exportItems').eq(0).as('firstListItem')
      cy.get('@exportItems').eq(1).as('secondListItem')
      cy.get('@exportItems').eq(2).as('thirdListItem')
      cy.get('@exportItems').eq(3).as('fourthListItem')
    })

    it('should display a list of exports', () => {
      cy.get('[data-test=no-export-items]').should('not.exist')
      cy.get('[data-test="export-item"]').should(
        'have.length',
        notArchivedExports.length
      )
    })

    it('should not show archived items', () => {
      cy.get(`a[href="${urls.exportPipeline.details(archived.id)}"]`).should(
        'not.exist'
      )
    })

    it('should display export potential tags', () => {
      assertExportPotentialTag('@firstListItem', 'High potential')
      assertExportPotentialTag('@secondListItem', 'Medium potential')
      assertExportPotentialTag('@thirdListItem', 'Low potential')
      assertExportPotentialTag('@fourthListItem', 'Low potential')
    })

    it('should display an export active tag', () => {
      assertStatusTag('@firstListItem', 'Active')
      assertStatusTag('@secondListItem', 'Won')
      assertStatusTag('@thirdListItem', 'Inactive')
      assertStatusTag('@fourthListItem', 'Inactive')
    })

    it('should display a company name header', () => {
      assertCompanyName('@firstListItem', 'Coca-Cola')
      assertCompanyName('@secondListItem', 'Alphabet')
      assertCompanyName('@thirdListItem', 'Meta')
      assertCompanyName('@fourthListItem', 'Sony')
    })

    it('should display a link to the company', () => {
      const linkIndex = 0
      assertLink(
        '@firstListItem',
        linkIndex,
        '/companies/1/overview',
        'Coca-Cola'
      )
      assertLink(
        '@secondListItem',
        linkIndex,
        '/companies/2/overview',
        'Alphabet'
      )
      assertLink('@thirdListItem', linkIndex, '/companies/3/overview', 'Meta')
      assertLink('@fourthListItem', linkIndex, '/companies/4/overview', 'Sony')
    })

    it('should display a link to the export', () => {
      const linkIndex = 1
      assertLink(
        '@firstListItem',
        linkIndex,
        '/export/1/details',
        'Export Coca-Cola'
      )
      assertLink(
        '@secondListItem',
        linkIndex,
        '/export/2/details',
        'Export Alphabet'
      )
      assertLink(
        '@thirdListItem',
        linkIndex,
        '/export/3/details',
        'Export Meta'
      )
      assertLink(
        '@fourthListItem',
        linkIndex,
        '/export/5/details',
        'Missing Migrated Data'
      )
    })

    it('should display a destination', () => {
      assertDestination('@firstListItem', 'Portugal')
      assertDestination('@secondListItem', 'Italy')
      assertDestination('@thirdListItem', 'Greece')
      assertDestination('@fourthListItem', 'Not set')
    })

    it('should display the total estimated export amount', () => {
      assertEstimatedExportAmount('@firstListItem', '£957,485')
      assertEstimatedExportAmount('@secondListItem', 'Not yet known')
      assertEstimatedExportAmount('@thirdListItem', '£858,211 (4 years)')
      assertEstimatedExportAmount('@fourthListItem', 'Not set')
    })

    it('should display an estimated win date', () => {
      assertEstimatedWinDate('@firstListItem', 'October 2023')
      assertEstimatedWinDate('@secondListItem', 'May 2023')
      assertEstimatedWinDate('@thirdListItem', 'February 2023')
      assertEstimatedWinDate('@fourthListItem', 'Not set')
    })

    it('should display a sector', () => {
      assertSector('@firstListItem', 'Energy')
      assertSector('@secondListItem', 'Mass Transport')
      assertSector('@thirdListItem', 'Security : Cyber Security')
      assertSector('@fourthListItem', 'Not set')
    })

    it('should display an owner', () => {
      assertOwner('@firstListItem', 'Benjamin Graham')
      assertOwner('@secondListItem', 'Warren Buffet')
      assertOwner('@thirdListItem', 'Peter Lynch')
      assertOwner('@fourthListItem', 'Ron Burgundy')
    })

    it('should display a created on date', () => {
      assertCreatedOnDate('@firstListItem', '20 Mar 2023, 9:19am')
      assertCreatedOnDate('@secondListItem', '19 Feb 2023, 9:29am')
      assertCreatedOnDate('@thirdListItem', '18 Jan 2023, 9:39am')
      assertCreatedOnDate('@fourthListItem', '19 Jul 2019, 10:39am')
    })

    it('should show and hide the content on toggle', () => {
      cy.get('[data-test="toggle-section-button"]').contains('Show').click()
      cy.get('[data-test="export-details"]').should('be.visible')
      cy.get('[data-test="toggle-section-button"]').contains('Hide').click()
      cy.get('[data-test="export-details"]').should('not.be.visible')
    })

    it('should show the pagination', () => {
      cy.get('[data-test="pagination"]').should('be.visible')
      cy.get('[data-test="page-number-active"]').should('have.text', '1')
      cy.get('[data-test="page-number"]').and('have.text', 2)
      cy.get('[data-test="next"]').should('be.visible')
    })
  })
})
