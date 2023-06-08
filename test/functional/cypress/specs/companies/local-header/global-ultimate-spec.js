const selectors = require('../../../../../selectors')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')
const {
  assertCompanyName,
  assertCompanyAddress,
  assertBadgeText,
  assertAddButton,
  assertReferButton,
  assertExportProjectButton,
  assertBreadcrumbs,
  assertExportCountryHistoryBreadcrumbs,
  assertOneListTierA,
  assertCoreTeam,
  assertArchivePanelNotVisible,
  assertAddInteractionButton,
  assertCompanyListItemButton,
} = require('../../../support/company-local-header-assertions')

const companyLocalHeader = selectors.companyLocalHeader()

const company = fixtures.company.dnbGlobalUltimate
const address =
  '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'

const advisersUrl = urls.companies.advisers.index(company.id)
const addRemoveFromListUrl = urls.companies.lists.addRemove(company.id)
const detailsUrl = urls.companies.detail(company.id)
const referralsUrl = urls.companies.referrals.send(company.id)
const dnbHierarchyUrl = urls.companies.dnbHierarchy.index(company.id)
const addInteractionUrl = urls.companies.interactions.create(company.id)
const exportProjectUrl = urls.exportPipeline.create(company.id)

describe('Local header for global ultimate company', () => {
  context('when visting a global ultimate company activity page', () => {
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

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the refer this company button', () => {
      assertReferButton(referralsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
  context('when visting a global ultimate company activity page', () => {
    before(() => {
      cy.visit(urls.companies.businessDetails(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Business details')

    it('should not display the archive panel', () => {
      assertArchivePanelNotVisible()
    })

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
  context('when visting a global ultimate company contacts page', () => {
    before(() => {
      cy.visit(urls.companies.contacts(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Contacts')

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
  context('when visting a global ultimate company core team page', () => {
    before(() => {
      cy.visit(advisersUrl)
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Core Team')

    it('should not display the archive panel', () => {
      assertArchivePanelNotVisible()
    })

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
  context(
    'when visting a global ultimate company investment projects page',
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

      it('should display the correct add interaction button', () => {
        assertAddInteractionButton(addInteractionUrl)
      })

      it('should display the add to list button', () => {
        assertAddButton(addRemoveFromListUrl, detailsUrl)
      })

      it('should display company list item buttons', () => {
        assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
      })

      it('should display the add export project button', () => {
        assertExportProjectButton(exportProjectUrl)
      })

      it('should display an "Ultimate HQ" badge', () => {
        assertBadgeText('Ultimate HQ')
      })

      it('should display "What does Ultimate HQ mean?" details', () => {
        assertMetaList()
      })

      it('should display the correct description', () => {
        assertDescription()
      })
    }
  )
  context(
    'when visting a global ultimate company investment large capital page',
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

      it('should display the correct add interaction button', () => {
        assertAddInteractionButton(addInteractionUrl)
      })

      it('should display the add to list button', () => {
        assertAddButton(addRemoveFromListUrl, detailsUrl)
      })

      it('should display company list item buttons', () => {
        assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
      })

      it('should display the add export project button', () => {
        assertExportProjectButton(exportProjectUrl)
      })

      it('should display an "Ultimate HQ" badge', () => {
        assertBadgeText('Ultimate HQ')
      })

      it('should display "What does Ultimate HQ mean?" details', () => {
        assertMetaList()
      })

      it('should display the correct description', () => {
        assertDescription()
      })
    }
  )
  context('when visting a global ultimate company export page', () => {
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

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
  context('when visting a global ultimate company export history page', () => {
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

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
  context('when visting a global ultimate company orders page', () => {
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

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the add to list button', () => {
      assertAddButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display company list item buttons', () => {
      assertCompanyListItemButton(addRemoveFromListUrl, detailsUrl)
    })

    it('should display the add export project button', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should display an "Ultimate HQ" badge', () => {
      assertBadgeText('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      assertMetaList()
    })

    it('should display the correct description', () => {
      assertDescription()
    })
  })
})

const assertMetaList = () => {
  cy.get(companyLocalHeader.metaList)
    .should('contain', 'What does Ultimate HQ mean?')
    .should(
      'contain',
      'This HQ is in control of all related company records for DnB Global Ultimate'
    )
}

const assertDescription = () => {
  cy.get(companyLocalHeader.description.paragraph(1))
    .contains(
      'Data Hub contains 2 other company records related to this company'
    )
    .contains('2 other company records')
    .should('have.attr', 'href', dnbHierarchyUrl)
  assertOneListTierA(2)
  assertCoreTeam(3, advisersUrl)
}
