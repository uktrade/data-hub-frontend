const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const {
  assertLocalNav,
} = require('../../../../end-to-end/cypress/support/assertions')

const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')
const {
  company: {
    dnbGlobalUltimate,
    dnbLtd,
    dnBGlobalUltimateAndGlobalHq,
    dnbSubsidiary,
  },
} = require('../../fixtures')

function assertRelatedCompaniesPage({
  company,
  areTabsVisible,
  companiesInHierarchy,
}) {
  before(() => {
    cy.visit(urls.companies.dnbHierarchy.index(company.id))
  })

  it('should render the header', () => {
    assertLocalHeader(`Company records related to ${company.name}`)
  })

  it('should render the helper text', () => {
    cy.contains(
      'This hierarchy information from Dun & Bradstreet cannot be edited.'
    )
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      'Business details': urls.companies.businessDetails(company.id),
      'Related companies': null,
    })
  })

  it('should render the list of companies', () => {
    cy.get(selectors.companyDnbHierarchy.collection)
      .should('contain', '2 related company records')
      .and('not.contain', company.name)
      .get('h3')
      .parent()
      .should('have.length', companiesInHierarchy.length)
      .each((item, i) => {
        const expectedCompany = companiesInHierarchy[i]
        const expectedHref = urls.companies.detail(expectedCompany.id)

        cy.get(item)
          .as('hierarchyItem')
          .contains(expectedCompany.name)
          .invoke('attr', 'href')
          .should('eq', expectedHref || undefined)

        cy.get('@hierarchyItem')
          .should('contain', 'Updated on')
          .should('contain', 'Address')

        if (
          expectedCompany.trading_names &&
          expectedCompany.trading_names.length
        ) {
          cy.get('@hierarchyItem').should(
            'contain',
            `Trading names ${expectedCompany.trading_names.join('')}`
          )
        }

        if (expectedCompany.sector) {
          cy.get('@hierarchyItem').should(
            'contain',
            `Sector ${expectedCompany.sector.name}`
          )
        }
      })
  })

  if (areTabsVisible) {
    it('should display the local nav', () => {
      assertLocalNav(selectors.tabbedLocalNav().tabs, [
        'Dun & Bradstreet hierarchy',
        'Manually linked subsidiaries',
      ])
    })
  } else {
    it('should not display the local nav', () => {
      cy.get(selectors.tabbedLocalNav().tabs).should('not.exist')
    })
  }
}

describe('D&B Company hierarchy', () => {
  context('when viewing hierarchy for a D&B Global Ultimate', () => {
    assertRelatedCompaniesPage({
      company: dnbGlobalUltimate,
      companiesInHierarchy: [dnbSubsidiary, dnbLtd],
      areTabsVisible: false,
    })

    it('should now show explanation why the D&B hierarchy might have fewer records than manual one', () => {
      cy.contains(
        "Why aren't all manually linked subsidiaries listed here?"
      ).should('not.exist')
    })
  })

  context(
    "when viewing a company which is a part of D&B hierarchy but isn't a Global Ultimate nor a Global HQ",
    () => {
      assertRelatedCompaniesPage({
        company: dnbSubsidiary,
        companiesInHierarchy: [dnbGlobalUltimate, dnbLtd],
        areTabsVisible: false,
      })
    }
  )

  context(
    'when viewing hierarchy for a D&B Global Ultimate which is also Global HQ',
    () => {
      assertRelatedCompaniesPage({
        company: dnBGlobalUltimateAndGlobalHq,
        companiesInHierarchy: [dnbSubsidiary, dnbLtd],
        areTabsVisible: true,
      })

      it('should show explanation why the D&B hierarchy might have fewer records than manual one', () => {
        cy.get(
          'details:contains("Why aren\'t all manually linked subsidiaries listed here?")'
        ).should(
          'have.text',
          '' +
            "Why aren't all manually linked subsidiaries listed here?This does not" +
            ' mean that Dun & Bradstreet does not know about those subsidiaries.The' +
            ' Dun & Bradstreet hierarchy information can only show the company records' +
            ' in Data Hub that have been matched to a verified Dun & Bradstreet record.' +
            ' This matching process is ongoing and more related company records will' +
            ' appear in the future.'
        )
      })
    }
  )
})
