const selectors = require('../../../../../selectors')
const { testBreadcrumbs } = require('../../../support/assertions')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

const address = 'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'

describe('Local header for company under dnb investigation', () => {
  context(
    'when visting a company under dnb investigation activity page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.activity.index(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.investigationLimited.name]: urls.companies.detail(
          fixtures.company.investigationLimited.id
        ),
        'Activity Feed': null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.investigationLimited.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View Options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.investigationLimited.id
          )}`
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
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(
            fixtures.company.investigationLimited.id
          )
        )
      })

      it('should display the investigation message', () => {
        cy.get(companyLocalHeader.investigationMessage).contains(
          'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
        )
      })
    }
  )
  context(
    'when visting a company under dnb investigation contacts page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.contacts(fixtures.company.investigationLimited.id)
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.investigationLimited.name]: urls.companies.detail(
          fixtures.company.investigationLimited.id
        ),
        Contacts: null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.investigationLimited.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View Options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.investigationLimited.id
          )}/contacts?sortby=modified_on%3Adesc&archived=false`
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
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(
            fixtures.company.investigationLimited.id
          )
        )
      })

      it('should display the investigation message', () => {
        cy.get(companyLocalHeader.investigationMessage).contains(
          'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
        )
      })
    }
  )
  context(
    'when visting a company under dnb investigation lead adviser page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.advisers.index(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.investigationLimited.name]: urls.companies.detail(
          fixtures.company.investigationLimited.id
        ),
        'Lead adviser': null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.investigationLimited.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View Options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.investigationLimited.id
          )}/advisers`
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
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(
            fixtures.company.investigationLimited.id
          )
        )
      })

      it('should display the investigation message', () => {
        cy.get(companyLocalHeader.investigationMessage).contains(
          'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
        )
      })
    }
  )
  context(
    'when visting a company under dnb investigation investment projects page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.investments.companyInvestment(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.investigationLimited.name]: urls.companies.detail(
          fixtures.company.investigationLimited.id
        ),
        Investment: null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.investigationLimited.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View Options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.investigationLimited.id
          )}/investments/projects`
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
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(
            fixtures.company.investigationLimited.id
          )
        )
      })

      it('should display the investigation message', () => {
        cy.get(companyLocalHeader.investigationMessage).contains(
          'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
        )
      })
    }
  )
  context(
    'when visting a company under dnb investigation investment large capital page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.investments.largeCapitalProfile(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.investigationLimited.name]: urls.companies.detail(
          fixtures.company.investigationLimited.id
        ),
        Investment: null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.investigationLimited.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View Options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.investigationLimited.id
          )}/investments/large-capital-profile`
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
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(
            fixtures.company.investigationLimited.id
          )
        )
      })

      it('should display the investigation message', () => {
        cy.get(companyLocalHeader.investigationMessage).contains(
          'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
        )
      })
    }
  )
  context('when visting a company under dnb investigation export page', () => {
    before(() => {
      cy.visit(
        urls.companies.exports.index(fixtures.company.investigationLimited.id)
      )
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.investigationLimited.name]: urls.companies.detail(
        fixtures.company.investigationLimited.id
      ),
      Exports: null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.investigationLimited.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View Options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.investigationLimited.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.investigationLimited.id
        )}/exports`
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
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.investigationLimited.id)
      )
    })

    it('should display the investigation message', () => {
      cy.get(companyLocalHeader.investigationMessage).contains(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      )
    })
  })
  context(
    'when visting a company under dnb investigation export history page',
    () => {
      before(() => {
        cy.visit(
          urls.companies.exports.history.index(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.investigationLimited.name]: urls.companies.detail(
          fixtures.company.investigationLimited.id
        ),
        Exports: urls.companies.exports.index(
          fixtures.company.investigationLimited.id
        ),
        'Export countries history': null,
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.investigationLimited.name
        )
      })

      it('should display the company address', () => {
        cy.get(companyLocalHeader.address).contains(address)
      })

      it('should display the correct buttons', () => {
        cy.contains('View Options').click()
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${urls.companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${urls.companies.detail(
            fixtures.company.investigationLimited.id
          )}/exports/history`
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
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          urls.companies.businessDetails(
            fixtures.company.investigationLimited.id
          )
        )
      })

      it('should display the investigation message', () => {
        cy.get(companyLocalHeader.investigationMessage).contains(
          'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
        )
      })
    }
  )
  context('when visting a company under dnb investigation orders page', () => {
    before(() => {
      cy.visit(urls.companies.orders(fixtures.company.investigationLimited.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [fixtures.company.investigationLimited.name]: urls.companies.detail(
        fixtures.company.investigationLimited.id
      ),
      'Orders (OMIS)': null,
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.investigationLimited.name
      )
    })

    it('should display the company address', () => {
      cy.get(companyLocalHeader.address).contains(address)
    })

    it('should display the correct buttons', () => {
      cy.contains('View Options').click()
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${urls.companies.lists.addRemove(
          fixtures.company.investigationLimited.id
        )}?returnUrl=${urls.companies.detail(
          fixtures.company.investigationLimited.id
        )}/orders`
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
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        urls.companies.businessDetails(fixtures.company.investigationLimited.id)
      )
    })

    it('should display the investigation message', () => {
      cy.get(companyLocalHeader.investigationMessage).contains(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      )
    })
  })
})
