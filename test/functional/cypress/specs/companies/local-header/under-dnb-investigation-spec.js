const selectors = require('../../../../../selectors')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')
const {
  assertCompanyName,
  assertCompanyAddress,
  assertBreadcrumbs,
  assertExportCountryHistoryBreadcrumbs,
  assertButtons,
  assertViewFullBusinessDetails,
  assertArchivePanelNotVisible,
} = require('../../../support/company-local-header-assertions')

const companyLocalHeader = selectors.companyLocalHeader()

const address = 'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
const company = fixtures.company.investigationLimited

const addRemoveFromListUrl = urls.companies.lists.addRemove(company.id)
const businessDetailsUrl = urls.companies.businessDetails(company.id)
const detailsUrl = urls.companies.detail(company.id)

describe('Local header for company under dnb investigation', () => {
  context(
    'when visting a company under dnb investigation activity page',
    () => {
      before(() => {
        cy.visit(urls.companies.activity.index(company.id))
      })

      assertBreadcrumbs(company.name, detailsUrl, 'Activity Feed')

      it('should not display the archive panel', () => {
        assertArchivePanelNotVisible()
      })

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct buttons', () => {
        assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}`)
      })

      it('should not display "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        assertViewFullBusinessDetails(businessDetailsUrl)
      })

      it('should display the investigation message', () => {
        assertInvestigationMessage()
      })
    }
  )
  context(
    'when visting a company under dnb investigation contacts page',
    () => {
      before(() => {
        cy.visit(urls.companies.contacts(company.id))
      })

      assertBreadcrumbs(company.name, detailsUrl, 'Contacts')

      it('should not display the archive panel', () => {
        assertArchivePanelNotVisible()
      })

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct buttons', () => {
        assertButtons(
          `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/contacts`
        )
      })

      it('should display a badge', () => {
        cy.get(companyLocalHeader.badge).should('exist')
      })

      it('should not display "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        assertViewFullBusinessDetails(businessDetailsUrl)
      })

      it('should display the investigation message', () => {
        assertInvestigationMessage()
      })
    }
  )
  context(
    'when visting a company under dnb investigation lead adviser page',
    () => {
      before(() => {
        cy.visit(urls.companies.advisers.index(company.id))
      })

      assertBreadcrumbs(company.name, detailsUrl, 'Lead adviser')

      it('should not display the archive panel', () => {
        assertArchivePanelNotVisible()
      })

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct buttons', () => {
        assertButtons(
          `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/advisers`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        assertViewFullBusinessDetails(businessDetailsUrl)
      })

      it('should display the investigation message', () => {
        assertInvestigationMessage()
      })
    }
  )
  context(
    'when visting a company under dnb investigation investment projects page',
    () => {
      before(() => {
        cy.visit(urls.companies.investments.companyInvestment(company.id))
      })

      assertBreadcrumbs(company.name, detailsUrl, 'Investment')

      it('should not display the archive panel', () => {
        assertArchivePanelNotVisible()
      })

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct buttons', () => {
        assertButtons(
          `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/investments/projects`
        )
      })

      it('should not display "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        assertViewFullBusinessDetails(businessDetailsUrl)
      })

      it('should display the investigation message', () => {
        assertInvestigationMessage()
      })
    }
  )
  context(
    'when visting a company under dnb investigation investment large capital page',
    () => {
      before(() => {
        cy.visit(urls.companies.investments.largeCapitalProfile(company.id))
      })

      assertBreadcrumbs(company.name, detailsUrl, 'Investment')

      it('should not display the archive panel', () => {
        assertArchivePanelNotVisible()
      })

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct buttons', () => {
        assertButtons(
          `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/investments/large-capital-profile`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        assertViewFullBusinessDetails(businessDetailsUrl)
      })

      it('should display the investigation message', () => {
        assertInvestigationMessage()
      })
    }
  )
  context('when visting a company under dnb investigation export page', () => {
    before(() => {
      cy.visit(urls.companies.exports.index(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Exports')

    it('should not display the archive panel', () => {
      assertArchivePanelNotVisible()
    })

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}/exports`)
    })

    it('should not display a badge', () => {
      cy.get(companyLocalHeader.badge).should('not.exist')
    })

    it('should not display "What does this mean?" details', () => {
      cy.get(companyLocalHeader.metaList).should('not.exist')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
    })

    it('should display the link to the full business details', () => {
      assertViewFullBusinessDetails(businessDetailsUrl)
    })

    it('should display the investigation message', () => {
      assertInvestigationMessage()
    })
  })
  context(
    'when visting a company under dnb investigation export history page',
    () => {
      before(() => {
        cy.visit(urls.companies.exports.history.index(company.id))
      })

      assertExportCountryHistoryBreadcrumbs(company, detailsUrl)

      it('should not display the archive panel', () => {
        assertArchivePanelNotVisible()
      })

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct buttons', () => {
        assertButtons(
          `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/exports/history`
        )
      })

      it('should display a badge', () => {
        cy.get(companyLocalHeader.badge).should('exist')
      })

      it('should not display "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        assertViewFullBusinessDetails(businessDetailsUrl)
      })

      it('should display the investigation message', () => {
        assertInvestigationMessage()
      })
    }
  )
  context('when visting a company under dnb investigation orders page', () => {
    before(() => {
      cy.visit(urls.companies.orders(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Orders (OMIS)')

    it('should not display the archive panel', () => {
      assertArchivePanelNotVisible()
    })

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}/orders`)
    })

    it('should not display "What does this mean?" details', () => {
      cy.get(companyLocalHeader.metaList).should('not.exist')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
    })

    it('should display the link to the full business details', () => {
      assertViewFullBusinessDetails(businessDetailsUrl)
    })

    it('should display the investigation message', () => {
      assertInvestigationMessage()
    })
  })
})

const assertInvestigationMessage = () => {
  cy.get(companyLocalHeader.investigationMessage).contains(
    'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
  )
}
