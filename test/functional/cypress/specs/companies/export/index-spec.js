const { company } = require('../../../fixtures')
const { assertBreadcrumbs } = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')

function visitExportIndex(companyId) {
  //cy.intercept('GET', '**/export-win').as('exportWinResults')
  cy.visit(urls.companies.exports.index(companyId))
  //cy.wait('@exportWinResults')
}

describe('Company Export tab', () => {
  function assertTable({ rows, caption, action }) {
    const TR_ALIAS = 'export-index-tr-rows'
    const CAPTION_ALIAS = 'export-index-caption'

    cy.contains('caption', caption)
      .as(CAPTION_ALIAS)
      .parent()
      .find('tr')
      .as(TR_ALIAS)

    if (action) {
      cy.get('@' + CAPTION_ALIAS)
        .find('a')
        .should('have.attr', 'href', action)
        .should('have.text', 'Edit')
    }

    rows.forEach((row, index) => {
      cy.get('@' + TR_ALIAS)
        .eq(index)
        .find('th')
        .should('have.text', row.label)
        .parent()
        .find('td')
        .should('have.text', row.value)
    })
  }

  function assertExportsTable(companyId, rows) {
    assertTable({
      caption: 'Exports',
      rows,
      action: urls.companies.exports.edit(companyId),
    })
  }

  function assertExportCountriesTable(companyId, rows) {
    assertTable({
      caption: 'Export countries information',
      rows,
      action: urls.companies.exports.editCountries(companyId),
    })
  }

  context(
    'when viewing the export tab for an active company with no export information and 8 Export Wins',
    () => {
      beforeEach(() => {
        visitExportIndex(company.dnbCorp.id)
      })

      it('should render a meta title', () => {
        cy.title().should('eq', 'Export - DnB Corp - Companies - DBT Data Hub')
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Companies: urls.companies.index(),
          [company.dnbCorp.name]: urls.companies.detail(company.dnbCorp.id),
          Exports: null,
        })
      })

      it('should render the "Exports" table', () => {
        assertExportsTable(company.dnbCorp.id, [
          { label: 'Export win category', value: 'None' },
          { label: 'great.gov.uk business profile', value: 'No profile' },
          { label: 'Export potential', value: 'No score given' },
          { label: 'Export potential last updated', value: 'No score given' },
        ])
      })

      it('should render the "What is export potential" dropdown', () => {
        cy.contains('What is export potential')
        cy.contains(
          "The export potential score is a prediction of a company's likelihood of exporting, and was originally created for the Find Exporters tool. DBT's data science team compared all HMRC export information with the features of all UK companies to find patterns; they then repeatedly tested their model against a subset of known-good data to improve it. The scores are as follows:Very High - Most companies like this one are exportersHigh - This business shares some features with successful exportersMedium - Some businesses that look like this one export, others don'tLow - This business shares many features with companies that do not exportVery Low - Most of the businesses like this aren't exportersWe are continuing to improve the algorithm so please do share your feedback or let us know of any anomalies through the support channel."
        )
        cy.contains('Find Exporters tool')
          .should(
            'have.attr',
            'href',
            urls.external.dataWorkspace.findExporters
          )
          .should('have.attr', 'aria-label', 'opens in a new tab')
      })

      it('should render the "Export countries information table', () => {
        assertExportCountriesTable(company.dnbCorp.id, [
          { label: 'Currently exporting to', value: 'None' },
          { label: 'Future countries of interest', value: 'None' },
          { label: 'Countries of no interest', value: 'None' },
        ])
      })

      it('should render the link to exports history', () => {
        cy.contains('View full export countries history').should(
          'have.attr',
          'href',
          urls.companies.exports.history.index(company.dnbCorp.id)
        )
      })

      it('should render the "Export wins" header', () => {
        cy.get('h3').eq(0).should('have.text', 'Export wins')
      })

      it('should render the "Add export win" button', () => {
        cy.get('[data-test="add-export-win"]')
          .should('have.text', 'Add export win')
          .should(
            'have.attr',
            'href',
            urls.companies.exportWins.create(company.dnbCorp.id)
          )
      })

      it('should render the "What is an export win" details', () => {
        cy.contains('What is an export win')
        cy.contains(
          'Export wins capture the export deals that Department for Business and Trade (DBT)'
        )
      })

      it('should render the message saying wins are not available', () => {
        cy.get('[data-test="wins-unavailable"]')
          .should('exist')
          .should(
            'contain',
            'This service is currently unavailable due to maintenance. Email datahubsupport@uktrade.zendesk.com if you have any questions'
          )
      })

      it.skip('should render the list of Export Wins without pagination', () => {
        const LIST_ALIAS = 'export-wins-collection-list'

        cy.contains('8 results').parent().parent().as(LIST_ALIAS)

        cy.get('@' + LIST_ALIAS).should('not.contain', 'Next')
        cy.get('@' + LIST_ALIAS).should('not.contain', 'Previous')

        cy.contains(
          'Ut eius quisquam qui quaerat adipisci dolorum sit similique.'
        )
          .siblings()
          .should('contain', 'Won on 04 Dec 2019')
          .should('contain', 'HVC')
          .should('contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Lucinda McLaughlin (voluptate dolores vel sed atque beatae)'
          )
          .should(
            'contain',
            'Company contact Reyes Hamill (sint aut in - Patricia.Kemmer@hotmail.com)'
          )
          .should('contain', 'Customer nam consequatur iste')
          .should('contain', 'Type of export dolor dolores magnam')
          .should('contain', 'Total export value £47,100')
          .should('contain', 'Type of win est cum hic')
          .should('contain', 'Country exported to Burkina Faso')
          .should('contain', 'Sector et aut adipisci')
          .should('contain', 'Company type ut consequatur qui')
          .should('contain', 'Date confirmed 23 Jul 2019')
          .should('contain', 'HVC name E186: consequatur modi dolorem')

        cy.contains('Ut repellendus sint.')
          .siblings()
          .should('contain', 'Won on 03 Nov 2019')
          .should('not.contain', 'HVC')
          .should('not.contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Dejon Swift Sr. (totam officiis consequatur alias nostrum quod)'
          )
          .should(
            'contain',
            'Company contact Dell Heaney (temporibus vero rem - Pauline.McCullough37@hotmail.com)'
          )
          .should('contain', 'Customer tempora esse accusamus')
          .should('contain', 'Type of export commodi enim id')
          .should('contain', 'Total export value £41,800')
          .should('contain', 'Type of win numquam et quo')
          .should('contain', 'Country exported to French Guiana')
          .should('contain', 'Sector molestiae rerum nostrum')
          .should('contain', 'Company type quas ea ut')
          .should('not.contain', 'Date confirmed')
          .should('not.contain', 'HVC name')

        cy.contains('Dolorem nesciunt adipisci optio')
          .siblings()
          .should('contain', 'Won on 19 Dec 2019')
          .should('contain', 'HVC')
          .should('not.contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Noble Koss (ex laborum rerum ut itaque quibusdam)'
          )
          .should(
            'contain',
            'Company contact Darron Wisozk (maiores ex ut - Claudia.Mraz20@hotmail.com)'
          )
          .should('contain', 'Customer est nobis saepe')
          .should('contain', 'Type of export omnis consequatur non')
          .should('contain', 'Total export value £99,400')
          .should('contain', 'Type of win ratione dolore dolorem')
          .should('contain', 'Country exported to Lebanon')
          .should('contain', 'Sector et inventore tempore')
          .should('contain', 'Company type veritatis non ullam')
          .should('not.contain', 'Date confirmed')
          .should('contain', 'HVC name E198: quidem accusamus velit')

        // company without a business_potential - this was added in Jun 2018
        cy.contains(
          'Labore quibusdam ut hic deleniti et harum ducimus repellendus.'
        )
          .siblings()
          .should('contain', 'Won on 11 Mar 2019')
          .should('contain', 'HVC')
          .should('not.contain', 'Confirmed')
          .should(
            'contain',
            'Lead officer Elias Hamill (nostrum quaerat maxime fugiat voluptatum quo)'
          )
          .should(
            'contain',
            'Company contact Damian Daugherty (qui minus quo - Georgianna78@gmail.com)'
          )
          .should('contain', 'Customer explicabo iusto quo')
          .should('contain', 'Type of export quis qui consequuntur')
          .should('contain', 'Total export value £36,300')
          .should('contain', 'Type of win et quisquam voluptatem')
          .should('contain', 'Country exported to Unknown')
          .should('contain', 'Sector voluptates molestiae cupiditate')
          .should('not.contain', 'Company type')
          .should('not.contain', 'Date confirmed')
          .should('contain', 'HVC name E188: sed culpa saepe')
      })
    }
  )

  context(
    'when viewing the export tab for an active company with export information in each field',
    () => {
      beforeEach(() => {
        cy.visit(urls.companies.exports.index(company.dnbLtd.id))
      })

      it('should render the "Exports" table', () => {
        assertExportsTable(company.dnbLtd.id, [
          { label: 'Export win category', value: 'Increasing export turnover' },
          {
            label: 'great.gov.uk business profile',
            value: '"Find a supplier" profile (opens in new tab)',
          },

          { label: 'Export potential', value: 'Medium' },
          { label: 'Export potential last updated', value: '2024-03-07' },
        ])

        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'href',
          urls.external.great.companyProfile(company.dnbLtd.company_number)
        )
      })

      it('should render the link to exports history', () => {
        cy.contains('View full export countries history').should(
          'have.attr',
          'href',
          urls.companies.exports.history.index(company.dnbLtd.id)
        )
      })

      it('should render the "Exports countries information" table', () => {
        assertExportCountriesTable(company.dnbLtd.id, [
          { label: 'Currently exporting to', value: 'France, Spain' },
          { label: 'Future countries of interest', value: 'Germany' },
          { label: 'Countries of no interest', value: 'Sweden' },
        ])
      })
    }
  )

  context('when viewing exports for an archived company', () => {
    beforeEach(() => {
      cy.visit(urls.companies.exports.index(company.archivedLtd.id))
    })

    it('the edit exports link should not exist', () => {
      cy.contains('caption', 'Exports')
        .contains('a', 'Edit')
        .should('not.exist')
    })

    it('the edit export countries link should not exist', () => {
      cy.contains('caption', 'Export countries information')
        .find('a', 'Edit')
        .should('not.exist')
    })
  })

  describe.skip('Export Wins', () => {
    function visitExports(companyId) {
      cy.intercept('**/export-win').as('exportWinsResults')
      cy.visit(urls.companies.exports.index(companyId))
      cy.wait('@exportWinsResults')
    }

    function assertErrorMessage(companyName) {
      cy.contains('8 results').should('not.exist')
      cy.contains('0 results').should('not.exist')
      cy.contains('Could not load Export wins')
        .should('exist')
        .siblings()
        .should(
          'contain',
          `We were unable to lookup Export Wins for ${companyName}, please try again later.`
        )
    }

    context('when the API for Export Wins returns a 501', () => {
      before(() => {
        visitExports(company.lambdaPlc.id)
      })

      it('shold not have an Export Wins list', () => {
        cy.contains('8 results').should('not.exist')
        cy.contains('0 results').should('not.exist')
        cy.contains('Could not load Export wins').should('not.exist')
      })
    })

    context('when the API for Export Wins returns a 500', () => {
      before(() => {
        visitExports(company.minimallyMinimalLtd.id)
      })

      it('should show an error message', () => {
        assertErrorMessage(company.minimallyMinimalLtd.name)
      })
    })

    context('when the API for Export Wins returns a 502', () => {
      before(() => {
        visitExports(company.investigationLimited.id)
      })

      it('should show an error message', () => {
        assertErrorMessage(company.investigationLimited.name)
      })
    })

    context('when the API for Export Wins returns a 404', () => {
      before(() => {
        visitExports(company.oneListCorp.id)
      })

      it('should show an error message', () => {
        assertErrorMessage(company.oneListCorp.name)
      })
    })

    context('When there is more than one page of results', () => {
      beforeEach(() => {
        visitExports(company.marsExportsLtd.id)
      })

      it('should not display a download data header', () => {
        cy.get('[data-test="download-data-header"]').should('not.exist')
      })

      it('should have the correct count and number of visible results', () => {
        cy.contains('15 results')
        cy.get('[data-test="collection-item"]').as('collectionItems')
        cy.get('@collectionItems').should('have.length', 10)
      })

      it('should display the next button', () => {
        cy.get('[data-test="next"]').should('have.text', 'Next')
      })

      it('should not display the previous button', () => {
        cy.get('[data-test="prev"]').should('not.exist')
      })

      it('the second page renders the collection list with 6 of the 15 results', () => {
        cy.get('[aria-label="Page 2"]').click()

        cy.get('[data-test="collection-item"]').as('collectionItems')
        cy.get('@collectionItems').should('have.length', 6)
        cy.contains(
          'Quis vel quidem quo cum nesciunt recusandae laboriosam dolor.'
        )
        cy.contains('Ut nam velit quis et.')
        cy.contains('Rerum ipsum eligendi quae rerum sunt.')
        cy.contains('Et deleniti et at beatae asperiores illo aut molestiae.')
        cy.contains('Et saepe ad praesentium quia illum voluptatum animi.')
        cy.contains('Vero ut aut saepe suscipit blanditiis repudiandae.')
      })

      it('should not display the next button', () => {
        cy.get('[aria-label="Page 2"]').click()
        cy.get('[data-test="next"]').should('not.exist')
      })

      it('should display the previous button', () => {
        cy.get('[aria-label="Page 2"]').click()
        cy.get('[data-test="prev"]').should('have.text', 'Previous')
      })
    })
  })
})
