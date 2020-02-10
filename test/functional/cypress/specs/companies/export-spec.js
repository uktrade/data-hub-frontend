const fixtures = require('../../fixtures')
const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')
const exportSelectors = require('../../../../selectors/company/export')

describe('Companies Export', () => {
  context(
    'when viewing the export tab for an active company with no export information',
    () => {
      before(() => {
        cy.visit(urls.companies.exports.index(fixtures.company.dnbCorp.id))
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Companies: '/companies',
          [fixtures.company.dnbCorp.name]: urls.companies.detail(
            fixtures.company.dnbCorp.id
          ),
          Exports: null,
        })
      })

      it('should render "Exports" caption', () => {
        cy.get('table:first caption').should('have.text', 'Exports')
      })

      it('should render the "Exports" table', () => {
        cy.get('th')
          .first()
          .should('have.text', 'Export win category')
        cy.get('th')
          .eq(1)
          .should('have.text', 'great.gov.uk business profile')
        cy.get('th')
          .eq(2)
          .should('have.text', 'Export potential')
        cy.get('td')
          .first()
          .should('have.text', 'None')
        cy.get('td')
          .eq(1)
          .should('have.text', 'No profile')
        cy.get('td')
          .eq(2)
          .should('have.text', 'No score given')
      })

      it('should render the "What is export potential" dropdown', () => {
        cy.contains('What is export potential')
        cy.contains(
          "The export potential score is a prediction of a company's likelihood of exporting, and was originally created for the Find Exporters tool. DIT's data science team compared all HMRC export information with the features of all UK companies to find patterns; they then repeatedly tested their model against a subset of known-good data to improve it. The scores are as follows:Very High - Most companies like this one are exportersHigh - This business shares some features with successful exportersMedium - Some businesses that look like this one export, others don'tLow - This business shares many features with companies that do not exportVery Low - Most of the businesses like this aren't exportersWe are continuing to improve the algorithm so please do share your feedback or let us know of any anomalies through the support channel."
        )
        cy.contains('Find Exporters tool').should(
          'have.attr',
          'href',
          urls.external.findExporters()
        )
        cy.contains('Find Exporters tool').should(
          'have.attr',
          'aria-label',
          'opens in a new tab'
        )
      })

      it('should render the "Export countries information header', () => {
        cy.get('h3')
          .first()
          .should('have.text', 'Export countries information')
      })

      it('should render the "Exports countries information" table', () => {
        cy.get('th')
          .eq(3)
          .should('have.text', 'Currently exporting to')
        cy.get('th')
          .eq(4)
          .should('have.text', 'Future countries of interest')
        cy.get('th')
          .eq(5)
          .should('have.text', 'Countries of no interest')
        cy.get('td')
          .eq(3)
          .should('have.text', 'None')
        cy.get('td')
          .eq(4)
          .should('have.text', 'None')
        cy.get('td')
          .eq(5)
          .should('have.text', 'None')
      })

      it('should render the "Edit export countries" button', () => {
        cy.contains('Edit export countries').should('have.prop', 'tagName', 'A')
      })

      it('should render the "Edit export countries" button with the correct link', () => {
        cy.contains('Edit export countries').should(
          'have.attr',
          'href',
          urls.companies.exports.edit(fixtures.company.dnbCorp.id)
        )
      })

      it('should render the "Export wins" header', () => {
        cy.get('h3')
          .eq(1)
          .should('have.text', 'Export wins')
      })

      it('should render the "Record your win on our Exports Wins site" paragraph', () => {
        cy.get('h3')
          .eq(1)
          .siblings('p')
          .should('have.text', 'Record your win on our Export Wins site')
      })

      it('should render the link to Export Wins', () => {
        cy.contains('Record your win').should(
          'have.attr',
          'href',
          urls.external.exportWins()
        )
        cy.contains('Record your win').should('have.attr', 'target', '_blank')
        cy.contains('Record your win').should(
          'have.attr',
          'aria-label',
          'opens in a new tab'
        )
      })
    }
  )

  context(
    'when viewing the export tab for an active company with export information in each field',
    () => {
      before(() => {
        cy.visit(urls.companies.exports.index(fixtures.company.dnbLtd.id))
      })

      it('should render the "Exports" table', () => {
        cy.get('th')
          .first()
          .should('have.text', 'Export win category')
        cy.get('th')
          .eq(1)
          .should('have.text', 'great.gov.uk business profile')
        cy.get('th')
          .eq(2)
          .should('have.text', 'Export potential')
        cy.get('td')
          .first()
          .should('have.text', 'Increasing export turnover')
        cy.get('td')
          .eq(1)
          .should('have.text', '"Find a supplier" profile')
        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'href',
          urls.external.greatProfile(fixtures.company.dnbLtd.company_number)
        )
        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'target',
          '_blank'
        )
        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'aria-label',
          'opens in a new tab'
        )
        cy.get('td')
          .eq(2)
          .should('have.text', 'Medium')
      })

      it('should render the "Exports countries information" table', () => {
        cy.get('th')
          .eq(3)
          .should('have.text', 'Currently exporting to')
        cy.get('th')
          .eq(4)
          .should('have.text', 'Future countries of interest')
        cy.get('th')
          .eq(5)
          .should('have.text', 'Countries of no interest')
        cy.get('td')
          .eq(3)
          .should('have.text', 'France, Spain')
        cy.get('td')
          .eq(4)
          .should('have.text', 'Germany')
        cy.get('td')
          .eq(5)
          .should('have.text', 'Sweden')
      })
    }
  )

  context('when viewing exports for an archived company', () => {
    before(() => {
      cy.visit(urls.companies.exports.index(fixtures.company.archivedLtd.id))
    })

    it('the edit expor countries button should not exist', () => {
      cy.contains('Edit export countries').should('not.exist')
    })
  })
})

describe('Companies Export Countries', () => {
  const countrySelectors = exportSelectors.countries

  context('when there is no history', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/exports/history`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.lambdaPlc.name]: urls.companies.detail(
          fixtures.company.lambdaPlc.id
        ),
        Exports: urls.companies.exports.index(fixtures.company.lambdaPlc.id),
        'Full export history': null,
      })
    })

    it('renders the title', () => {
      cy.contains('Export markets history').should('exist')
    })

    it('renders the collection list with the 0 results', () => {
      cy.contains('0 results').should('exist')
      cy.get(countrySelectors.listItemHeadings).should('have.length', 0)
    })
  })

  context('when there is history', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.dnbCorp.id}/exports/history`)
    })

    it('renders the title', () => {
      cy.contains('Export markets history').should('exist')
    })

    it('renders the collection list with the 7 results', () => {
      cy.contains('7 results').should('exist')
      cy.get(countrySelectors.listItemHeadings).should('have.length', 7)

      cy.contains('Argentina added to currently exporting').should('exist')
      cy.contains('Argentina added to currently exporting')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', 'Date 6 Feb 2020, 4:06pm')
      cy.contains('Andorra added to currently exporting').should('exist')
      cy.contains('Andorra added to currently exporting')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', 'Date 6 Feb 2020, 4:06pm')
      cy.contains('Afghanistan added to future countries of interest').should(
        'exist'
      )
      cy.contains('Afghanistan added to future countries of interest')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', '6 Feb 2020, 3:42pm')
      cy.contains('Andorra removed from future countries of interest').should(
        'exist'
      )
      cy.contains('Andorra removed from future countries of interest')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', 'Date 6 Feb 2020, 3:41pm')
      cy.contains('Angola added to countries of no interest').should('exist')
      cy.contains('Angola added to countries of no interest')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', 'Date 6 Feb 2020, 3:41pm')
      cy.contains('Andorra added to future countries of interest').should(
        'exist'
      )
      cy.contains('Andorra added to future countries of interest')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', 'Date 6 Feb 2020, 3:40pm')
      cy.contains('Albania added to currently exporting').should('exist')
      cy.contains('Albania added to currently exporting')
        .siblings()
        .should('contain', 'By DIT Staff')
        .should('contain', 'Date 6 Feb 2020, 3:40pm')
    })
  })
})
