const selectors = require('../../../../../selectors')
const { testBreadcrumbs } = require('../../../support/assertions')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

const address =
  '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'

describe('Local header for global ultimate company', () => {
  context('when visting a global ultimate company activity page', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.dnbGlobalUltimate.id)
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
        fixtures.company.dnbGlobalUltimate.id
      ),
      'Activity Feed': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
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
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get(companyLocalHeader.metaList)
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          urls.companies.dnbHierarchy.index(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      cy.get(companyLocalHeader.description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company contacts page', () => {
    before(() => {
      cy.visit(urls.companies.contacts(fixtures.company.dnbGlobalUltimate.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
        fixtures.company.dnbGlobalUltimate.id
      ),
      Contacts: null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
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
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/contacts?sortby=modified_on%3Adesc&archived=false`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get(companyLocalHeader.metaList)
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          urls.companies.dnbHierarchy.index(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      cy.get(companyLocalHeader.description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company core team page', () => {
    before(() => {
      cy.visit(
        urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
        fixtures.company.dnbGlobalUltimate.id
      ),
      'Core Team': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
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
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/advisers`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get(companyLocalHeader.metaList)
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          urls.companies.dnbHierarchy.index(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      cy.get(companyLocalHeader.description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context(
    'when visting a global ultimate company investment projects page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.investments.companyInvestment(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        Investment: null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.dnbGlobalUltimate.name
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
            fixtures.company.dnbGlobalUltimate.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.dnbGlobalUltimate.id
          )}/investments/projects`
        )
      })

      it('should display an "Ultimate HQ" badge', () => {
        cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
      })

      it('should display "What does Ultimate HQ mean?" details', () => {
        cy.get(companyLocalHeader.metaList)
          .should('contain', 'What does Ultimate HQ mean?')
          .should(
            'contain',
            'This HQ is in control of all related company records for DnB Global Ultimate'
          )
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1))
          .contains(
            'Data Hub contains 2 other company records related to this company'
          )
          .contains('2 other company records')
          .should(
            'have.attr',
            'href',
            urls.companies.dnbHierarchy.index(
              fixtures.company.dnbGlobalUltimate.id
            )
          )
        cy.get(companyLocalHeader.description.paragraph(2)).contains(
          'This is an account managed company (One List Tier A - Strategic Account)'
        )
        cy.get(companyLocalHeader.description.paragraph(3))
          .contains('Global Account Manager: Travis Greene View core team')
          .contains('View core team')
          .should(
            'have.attr',
            'href',
            urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
          )
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
        )
      })
    }
  )
  context(
    'when visting a global ultimate company investment large capital page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.investments.largeCapitalProfile(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        ),
        Investment: null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.dnbGlobalUltimate.name
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
            fixtures.company.dnbGlobalUltimate.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.dnbGlobalUltimate.id
          )}/investments/large-capital-profile`
        )
      })

      it('should display an "Ultimate HQ" badge', () => {
        cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
      })

      it('should display "What does Ultimate HQ mean?" details', () => {
        cy.get(companyLocalHeader.metaList)
          .should('contain', 'What does Ultimate HQ mean?')
          .should(
            'contain',
            'This HQ is in control of all related company records for DnB Global Ultimate'
          )
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1))
          .contains(
            'Data Hub contains 2 other company records related to this company'
          )
          .contains('2 other company records')
          .should(
            'have.attr',
            'href',
            urls.companies.dnbHierarchy.index(
              fixtures.company.dnbGlobalUltimate.id
            )
          )
        cy.get(companyLocalHeader.description.paragraph(2)).contains(
          'This is an account managed company (One List Tier A - Strategic Account)'
        )
        cy.get(companyLocalHeader.description.paragraph(3))
          .contains('Global Account Manager: Travis Greene View core team')
          .contains('View core team')
          .should(
            'have.attr',
            'href',
            urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
          )
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
        )
      })
    }
  )
  context('when visting a global ultimate company export page', () => {
    before(() => {
      cy.visit(
        urls.companies.exports.index(fixtures.company.dnbGlobalUltimate.id)
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
        fixtures.company.dnbGlobalUltimate.id
      ),
      Exports: null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
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
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/exports`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get(companyLocalHeader.metaList)
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          urls.companies.dnbHierarchy.index(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      cy.get(companyLocalHeader.description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company export history page', () => {
    before(() => {
      cy.visit(
        urls.companies.exports.history.index(
          fixtures.company.dnbGlobalUltimate.id
        )
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
        fixtures.company.dnbGlobalUltimate.id
      ),
      Exports: urls.companies.exports.index(
        fixtures.company.dnbGlobalUltimate.id
      ),
      'Export countries history': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
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
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/exports/history`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get(companyLocalHeader.metaList)
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          urls.companies.dnbHierarchy.index(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      cy.get(companyLocalHeader.description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
  context('when visting a global ultimate company orders page', () => {
    before(() => {
      cy.visit(urls.companies.orders(fixtures.company.dnbGlobalUltimate.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.dnbGlobalUltimate.name]: urls.companies.detail(
        fixtures.company.dnbGlobalUltimate.id
      ),
      'Orders (OMIS)': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.dnbGlobalUltimate.name
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
          fixtures.company.dnbGlobalUltimate.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.dnbGlobalUltimate.id
        )}/orders`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(companyLocalHeader.badge).contains('Ultimate HQ')
    })

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get(companyLocalHeader.metaList)
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1))
        .contains(
          'Data Hub contains 2 other company records related to this company'
        )
        .contains('2 other company records')
        .should(
          'have.attr',
          'href',
          urls.companies.dnbHierarchy.index(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
      cy.get(companyLocalHeader.description.paragraph(2)).contains(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
      cy.get(companyLocalHeader.description.paragraph(3))
        .contains('Global Account Manager: Travis Greene View core team')
        .contains('View core team')
        .should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.dnbGlobalUltimate.id)
        )
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
      )
    })
  })
})
