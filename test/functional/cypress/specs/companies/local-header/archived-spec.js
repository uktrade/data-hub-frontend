const selectors = require('../../../../../selectors')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')
const {
  assertCompanyName,
  assertCompanyAddress,
  assertBadgeText,
  assertButtons,
  assertBreadcrumbs,
  assertExportCountryHistoryBreadcrumbs,
  assertOneListTierA,
  assertCoreTeam,
  assertAddInteractionButton,
} = require('../../../support/company-local-header-assertions')

const companyLocalHeader = selectors.companyLocalHeader()

const address = '16 Getabergsvagen, Geta, 22340, Malta'
const archiveMessage =
  'This company was archived on 06 Jul 2018 by John Rogers.'
const company = fixtures.company.archivedLtd

const advisersUrl = urls.companies.advisers.index(company.id)
const addRemoveFromListUrl = urls.companies.lists.addRemove(company.id)
const detailsUrl = urls.companies.detail(company.id)
const unarchiveUrl = urls.companies.unarchive(company.id)
const addInteractionUrl = urls.companies.interactions.create(company.id)

describe('Local header for archived company', () => {
  context('when visting an archived company activity page', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Activity Feed')

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}`)
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
  context('when visting an archived company contacts page', () => {
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

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}/contacts`)
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
  context('when visting an archived company core team page', () => {
    before(() => {
      cy.visit(advisersUrl)
    })
    assertBreadcrumbs(company.name, detailsUrl, 'Core Team')
    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}/advisers`)
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
  context('when visting an archived company investment projects page', () => {
    before(() => {
      cy.visit(urls.companies.investments.companyInvestment(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Investment')

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the correct buttons', () => {
      assertButtons(
        `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/investments/projects`
      )
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
  context(
    'when visting an archived company investment large capital page',
    () => {
      before(() => {
        cy.visit(urls.companies.investments.largeCapitalProfile(company.id))
      })

      assertBreadcrumbs(company.name, detailsUrl, 'Investment')

      it('should display the company name', () => {
        assertCompanyName(company.name)
      })

      it('should display the company address', () => {
        assertCompanyAddress(address)
      })

      it('should display the correct add interaction button', () => {
        assertAddInteractionButton(addInteractionUrl)
      })

      it('should display the correct buttons', () => {
        assertButtons(
          `${urls.companies.lists.addRemove(
            company.id
          )}?returnUrl=${urls.companies.detail(
            company.id
          )}/investments/large-capital-profile`
        )
      })

      it('should display a "Global HQ" badge', () => {
        assertBadgeText('Global HQ')
      })
      it('should display the correct description', () => {
        assertOneListTierA(1)
        assertCoreTeam(2, advisersUrl)
      })

      it('should display the archived message', () => {
        assertArchiveMessage()
      })
    }
  )
  context('when visting an archived company export page', () => {
    before(() => {
      cy.visit(urls.companies.exports.index(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Exports')

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}/exports`)
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
  context('when visting an archived company export history page', () => {
    before(() => {
      cy.visit(urls.companies.exports.history.index(company.id))
    })

    assertExportCountryHistoryBreadcrumbs(company, detailsUrl)

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the correct buttons', () => {
      assertButtons(
        `${addRemoveFromListUrl}?returnUrl=${detailsUrl}/exports/history`
      )
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
  context('when visting an archived company orders page', () => {
    before(() => {
      cy.visit(urls.companies.orders(company.id))
    })

    assertBreadcrumbs(company.name, detailsUrl, 'Orders (OMIS)')

    it('should display the company name', () => {
      assertCompanyName(company.name)
    })

    it('should display the company address', () => {
      assertCompanyAddress(address)
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should display the correct buttons', () => {
      assertButtons(`${addRemoveFromListUrl}?returnUrl=${detailsUrl}/orders`)
    })

    it('should display a "Global HQ" badge', () => {
      assertBadgeText('Global HQ')
    })

    it('should display the correct description', () => {
      assertOneListTierA(1)
      assertCoreTeam(2, advisersUrl)
    })

    it('should display the archived message', () => {
      assertArchiveMessage()
    })
  })
})

const assertArchiveMessage = () => {
  cy.get(companyLocalHeader.archiveMessage)
    .should('exist')
    .contains(archiveMessage)
  cy.get(companyLocalHeader.archiveReason)
    .should('exist')
    .contains('Reason: Company is dissolved')
  cy.get(companyLocalHeader.unarchiveButton)
    .contains('Unarchive')
    .should('have.attr', 'href', unarchiveUrl)
}
