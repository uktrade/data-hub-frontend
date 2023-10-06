const { assertBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const assertBusinessDetailsBreadcrumbs = (company) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      'Business details': null,
    })
  })
}

const assertLastUpdatedParagraph = (date) => {
  const paragraphText = 'Last updated on: ' + date
  it('should display the "Last updated" paragraph', () => {
    cy.contains(paragraphText).should('be.visible')
  })
}

const assertAreDetailsRight = () => {
  it('should display the "Are these business details right?" details summary', () => {
    cy.get(selectors.companyBusinessDetails().whereDoesInformation).should(
      'be.visible'
    )
  })
}

const assertAreDetailsRightNotVisible = () => {
  it('should not display the "Are these business details right?" details summary', () => {
    cy.get(selectors.companyBusinessDetails().whereDoesInformation).should(
      'not.exist'
    )
  })
}

const assertUnarchiveLinkNotVisible = () => {
  it('should not display the "Unarchive" link', () => {
    cy.get(selectors.companyBusinessDetails().unarchiveLink).should('not.exist')
  })
}

const assertArchiveContainerNotVisible = () => {
  it('should not display the "Archive company" details container', () => {
    cy.get('[data-test=archive-company-container]').should('not.exist')
  })
}

const assertArchiveContainerVisible = () => {
  it('should display the "Archive company" details container', () => {
    cy.get('[data-test=archive-company-container]').should('be.visible')
  })
}

const assertArchivePanelNotVisible = () => {
  it('should not render the archive panel', () => {
    cy.get('[data-test=archive-panel]').should('not.exist')
  })
}

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

      assertBusinessDetailsBreadcrumbs(fixtures.company.oneListCorp)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('26 Nov 2017')

      it('should not display the "Pending Change Request" box', () => {
        cy.contains(
          'Changes to these business details are currently being reviewed.'
        ).should('not.exist')
      })

      assertAreDetailsRight()
      assertUnarchiveLinkNotVisible()

      assertArchiveContainerNotVisible()
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
        cy.go('back')
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

      assertBusinessDetailsBreadcrumbs(fixtures.company.venusLtd)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('15 Jul 2016')
      assertAreDetailsRightNotVisible()
      assertUnarchiveLinkNotVisible()

      assertLastUpdatedParagraph('15 Jul 2016')
      assertArchiveContainerVisible()
    }
  )

  context(
    'when viewing business details for a Dun & Bradstreet company not on the One List',
    () => {
      before(() => {
        cy.visit(urls.companies.businessDetails(fixtures.company.dnbCorp.id))
        it('should display the "Pending Change Request" text', () => {
          cy.contains('Checking for pending change requests')
        })
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.dnbCorp)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('26 Oct 2018')
      assertAreDetailsRight()
      assertUnarchiveLinkNotVisible()

      assertArchiveContainerNotVisible()
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

      assertBusinessDetailsBreadcrumbs(fixtures.company.archivedLtd)
      assertLastUpdatedParagraph('16 Jul 2017')
      assertAreDetailsRightNotVisible()

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

      assertArchiveContainerNotVisible()
    }
  )

  context(
    'when viewing business details for a company with minimal data',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(
            fixtures.company.minimallyMinimalLtd.id
          )
        )
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.minimallyMinimalLtd)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('11 Dec 2015')
      assertAreDetailsRightNotVisible()
      assertUnarchiveLinkNotVisible()

      assertArchiveContainerVisible()
    }
  )
})
