const selectors = require('../../../../../selectors')
const { testBreadcrumbs } = require('../../../support/assertions')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

const address = '16 Getabergsvagen, Geta, 22340, Malta'

describe('Local header for archived company', () => {
  context('when visting an archived company activity page', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.archivedLtd.id))
    })
    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      'Activity Feed': null,
    })
    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(fixtures.company.archivedLtd.id)}`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )

      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
  context('when visting an archived company contacts page', () => {
    before(() => {
      cy.visit(urls.companies.contacts(fixtures.company.archivedLtd.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      Contacts: null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.archivedLtd.id
        )}/contacts?sortby=modified_on%3Adesc&archived=false`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )

      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
  context('when visting an archived company core team page', () => {
    before(() => {
      cy.visit(urls.companies.advisers.index(fixtures.company.archivedLtd.id))
    })
    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      'Core Team': null,
    })
    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.archivedLtd.id
        )}/advisers`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )

      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
  context('when visting an archived company investment projects page', () => {
    before(() => {
      cy.visit(
        urls.companies.investments.companyInvestment(
          fixtures.company.archivedLtd.id
        )
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      Investment: null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.archivedLtd.id
        )}/investments/projects`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
  context(
    'when visting an archived company investment large capital page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.investments.largeCapitalProfile(
            fixtures.company.archivedLtd.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.archivedLtd.name]: urls.companies.detail(
          fixtures.company.archivedLtd.id
        ),
        Investment: null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.archivedLtd.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.archivedLtd.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.archivedLtd.id
          )}/investments/large-capital-profile`
        )
      })

      it('should display an "Ultimate HQ" badge', () => {
        cy.get(companyLocalHeader.badge).contains('Global HQ')
      })
      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).contains(
          'This is an account managed company (One List Tier A - Strategic Account)'
        )

        cy.get(companyLocalHeader.description.paragraph(2))
          .contains('Global Account Manager: Travis Greene View core team')
          .contains('View core team')
          .should(
            'have.attr',
            'href',
            urls.companies.advisers.index(fixtures.company.archivedLtd.id)
          )
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(fixtures.company.archivedLtd.id)
        )
      })

      it('should display the archived message', () => {
        cy.get(companyLocalHeader.archivedMessage)
          .contains('This company was archived on 06 Jul 2018 by John Rogers.')
          .contains('Reason: Company is dissolved')
          .contains('Unarchive')
          .should(
            'have.attr',
            'href',
            urls.companies.unarchive(fixtures.company.archivedLtd.id)
          )
      })
    }
  )
  context('when visting an archived company export page', () => {
    before(() => {
      cy.visit(urls.companies.exports.index(fixtures.company.archivedLtd.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      Exports: null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.archivedLtd.id
        )}/exports`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )

      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
  context('when visting an archived company export history page', () => {
    before(() => {
      cy.visit(
        urls.companies.exports.history.index(fixtures.company.archivedLtd.id)
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      Exports: urls.companies.exports.index(fixtures.company.archivedLtd.id),
      'Export countries history': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.archivedLtd.id
        )}/exports/history`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )

      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
  context('when visting an archived company orders page', () => {
    before(() => {
      cy.visit(urls.companies.orders(fixtures.company.archivedLtd.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.archivedLtd.name]: urls.companies.detail(
        fixtures.company.archivedLtd.id
      ),
      'Orders (OMIS)': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.archivedLtd.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.archivedLtd.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.archivedLtd.id
        )}/orders`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Global HQ')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )

      cy.get(companyLocalHeader.description.paragraph(2))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.archivedLtd.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.archivedLtd.id)
      )
    })

    it('should display the archived message', () => {
      cy.get(companyLocalHeader.archivedMessage)
        .contains('This company was archived on 06 Jul 2018 by John Rogers.')
        .contains('Reason: Company is dissolved')
        .contains('Unarchive')
        .should(
          'have.attr',
          'href',
          urls.companies.unarchive(fixtures.company.archivedLtd.id)
        )
    })
  })
})
