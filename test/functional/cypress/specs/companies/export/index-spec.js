const { company } = require('../../../fixtures')
const { assertBreadcrumbs } = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')

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
      beforeEach(() =>
        cy.visit(urls.companies.exports.index(company.dnbCorp.id))
      )

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
})
