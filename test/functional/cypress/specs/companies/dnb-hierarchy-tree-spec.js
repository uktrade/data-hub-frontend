import { companyTreeFaker } from '../../fakers/dnb-hierarchy'

const {
  assertErrorDialog,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

const urls = require('../../../../../src/lib/urls')

const {
  company: { dnbGlobalUltimate },
} = require('../../fixtures')

const companyOnlyImmediateSubsidiaries = companyTreeFaker({})

const assertRelatedCompaniesPage = ({ company }) => {
  it('should render the header', () => {
    assertLocalHeader(`Company records related to ${company.name}`)
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.overview.index(company.id),
      'Business details': urls.companies.businessDetails(company.id),
      'Related companies': null,
    })
  })
}

describe('D&B Company hierarchy tree', () => {
  context('Error scenarios:', () => {
    context(
      'when attempting to view the hierarchy of an unknown company',
      () => {
        const unknownId = 1
        before(() => {
          cy.intercept(`api-proxy/v4/company/${unknownId}`, {
            statusCode: 404,
          }).as('companyApi')
          cy.visit(urls.companies.dnbHierarchy.tree(unknownId))
        })
        it('should display the access denied page', () => {
          cy.wait('@companyApi')
          assertErrorDialog('TASK_GET_COMPANY_DETAIL', 'Not Found')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a company without a D&B id',
      () => {
        const accessDeniedId = 2
        before(() => {
          cy.intercept(`api-proxy/v4/company/${accessDeniedId}`, {
            id: accessDeniedId,
            duns_number: null,
          }).as('companyApi')
          cy.visit(urls.companies.dnbHierarchy.tree(accessDeniedId))
        })

        it('should display the access denied page', () => {
          cy.wait('@companyApi')
          cy.get('[data-test="access-denied"]').should('be.visible')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a known company and the family tree api errors',
      () => {
        before(() => {
          cy.intercept(`api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`, {
            statusCode: 404,
          }).as('familyTreeApi')
          cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
        })

        it('should display the error message', () => {
          cy.wait('@familyTreeApi')
          cy.get('[data-test="company-tree-loaded-error"]').should('be.visible')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a known company and the family tree api returns no data',
      () => {
        before(() => {
          cy.intercept(`api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`, {
            body: {},
          }).as('familyTreeApi')
          cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
        })

        it('should display the empty tree message', () => {
          cy.wait('@familyTreeApi')
          cy.get('[data-test="empty-hierarchy"]').should('be.visible')
        })
      }
    )
  })

  context('When a company is the requested company', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyOnlyImmediateSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })
})
