const { assertCompanyBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Companies business details', () => {
  context(
    'when viewing business details for a Dun & Bradstreet GHQ company on the One List not in the UK',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.oneListCorp.id)
        )

        it('should display the "Pending Change Request" text', () => {
          cy.contains('Checking for pending change requests')
        })
      })

      assertCompanyBreadcrumbs(
        fixtures.company.oneListCorp.name,
        urls.companies.detail(fixtures.company.oneListCorp.id),
        'Business details'
      )

      it('should display the "Last updated" paragraph', () => {
        cy.contains('Last updated on: 26 Nov 2017').should('be.visible')
      })

      it('should display the "Are these business details right?" details summary', () => {
        cy.get(selectors.companyBusinessDetails().whereDoesInformation).should(
          'be.visible'
        )
      })

      it('should not display the "Unarchive" link', () => {
        cy.get(selectors.companyBusinessDetails().unarchiveLink).should(
          'not.exist'
        )
      })

      it('should not render the archive panel', () => {
        cy.get('[data-test=archive-panel]').should('not.exist')
      })

      it('should not display the "Pending Change Request" box', () => {
        cy.contains(
          'Changes to these business details are currently being reviewed.'
        ).should('not.exist')
      })

      it('should not display the "Archive company" details container', () => {
        cy.get('[data-test=archive-company-container]').should('not.exist')
      })
    }
  )

  context(
    'when viewing business details for a Dun & Bradstreet company with a global ultimate',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
        )
      })

      it('the card should link to the company tree page', () => {
        cy.get('[data-test="company-tree-link"]')
          .contains('other company records')
          .click()
        cy.location('pathname').should(
          'eq',
          urls.companies.dnbHierarchy.tree(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      })
    }
  )

  context(
    'when viewing business details for a Data Hub company on the One List in the UK',
    () => {
      before(() => {
        cy.visit(urls.companies.businessDetails(fixtures.company.venusLtd.id))
      })

      it('should not display the "Pending Change Request" text', () => {
        cy.contains('Checking for pending change requests').should('not.exist')
      })

      it('should display the "Archive company" details container', () => {
        cy.get('[data-test=archive-company-container]').should('be.visible')
      })

      it('should not display the "Are these business details right?" details summary', () => {
        cy.get(selectors.companyBusinessDetails().whereDoesInformation).should(
          'not.exist'
        )
      })
    }
  )

  context(
    'when viewing business details for an automatically archived Data Hub company',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(
            fixtures.company.automaticallyArchivedLtd.id
          )
        )
      })

      it('should display it was automatically archived and the date', () => {
        cy.contains(
          'This company was automatically archived on 06 Jul 2018.'
        ).should('be.visible')
      })

      it('should display the reason it was archived', () => {
        cy.contains('Reason: Company is dissolved').should('be.visible')
      })
    }
  )

  context(
    'when viewing business details for an archived Data Hub company',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.archivedLtd.id)
        )
      })

      it('should display the date the company was archived and by whom', () => {
        cy.contains(
          'This company was archived on 06 Jul 2018 by John Rogers'
        ).should('be.visible')
      })

      it('should display the reason it was dissolved', () => {
        cy.contains('Reason: Company is dissolved').should('be.visible')
      })

      it('should display the "Unarchive" link', () => {
        cy.contains('Unarchive').should('be.visible')
      })
    }
  )
})
