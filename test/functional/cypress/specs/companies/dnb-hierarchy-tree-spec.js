const { assertErrorDialog } = require('../../support/assertions')

const urls = require('../../../../../src/lib/urls')

const {
  company: { dnbGlobalUltimate },
} = require('../../fixtures')

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
          cy.visit(urls.companies.dnbHierarchy.index(unknownId))
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
            global_ultimate_duns_number: null,
          }).as('companyApi')
          cy.visit(urls.companies.dnbHierarchy.index(accessDeniedId))
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
          cy.visit(urls.companies.dnbHierarchy.index(dnbGlobalUltimate.id))
        })

        it('should display the error message', () => {
          cy.wait('@familyTreeApi')
          assertErrorDialog('TASK_GET_DNB_FAMILY_TREE', 'Not Found')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a known company and the family tree api returns no data',
      () => {
        before(() => {
          cy.intercept(`api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`, {
            ultimate_global_company: {},
            manually_verified_subsidiaries: [],
          }).as('familyTreeApi')
          cy.visit(urls.companies.dnbHierarchy.index(dnbGlobalUltimate.id))
        })

        it('should display the error message', () => {
          cy.wait('@familyTreeApi')
          assertErrorDialog('TASK_GET_DNB_FAMILY_TREE', 'Not Found')
        })
      }
    )
  })
})
