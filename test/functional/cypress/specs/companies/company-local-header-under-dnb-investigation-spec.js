const selectors = require('../../../../selectors')
const { testBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { companies, dashboard } = require('../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

describe('Local header for company under dnb investigation', () => {
  context(
    'when visting a company under dnb investigation activity page',
    () => {
      before(() => {
        cy.visit(
          companies.activity.index(fixtures.company.investigationLimited.id)
        )
      })

      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        [fixtures.company.investigationLimited.name]: companies.detail(
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
        cy.get(companyLocalHeader.address).contains(
          'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${companies.detail(
            fixtures.company.investigationLimited.id
          )}`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display an "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.investigationLimited.id)
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
        cy.visit(companies.contacts(fixtures.company.investigationLimited.id))
      })

      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        [fixtures.company.investigationLimited.name]: companies.detail(
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
        cy.get(companyLocalHeader.address).contains(
          'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${companies.detail(
            fixtures.company.investigationLimited.id
          )}/contacts?sortby=modified_on%3Adesc&archived=false`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display an "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.investigationLimited.id)
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
          companies.advisers.index(fixtures.company.investigationLimited.id)
        )
      })

      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        [fixtures.company.investigationLimited.name]: companies.detail(
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
        cy.get(companyLocalHeader.address).contains(
          'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${companies.detail(
            fixtures.company.investigationLimited.id
          )}/advisers`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display an "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.investigationLimited.id)
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
          companies.investments.companyInvestment(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        [fixtures.company.investigationLimited.name]: companies.detail(
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
        cy.get(companyLocalHeader.address).contains(
          'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${companies.detail(
            fixtures.company.investigationLimited.id
          )}/investments/projects`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display an "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.investigationLimited.id)
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
          companies.investments.largeCapitalProfile(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        [fixtures.company.investigationLimited.name]: companies.detail(
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
        cy.get(companyLocalHeader.address).contains(
          'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${companies.detail(
            fixtures.company.investigationLimited.id
          )}/investments/large-capital-profile`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display an "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.investigationLimited.id)
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
        companies.exports.index(fixtures.company.investigationLimited.id)
      )
    })

    testBreadcrumbs({
      Home: dashboard(),
      Companies: companies.index(),
      [fixtures.company.investigationLimited.name]: companies.detail(
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
      cy.get(companyLocalHeader.address).contains(
        'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.investigationLimited.id
        )}?returnUrl=${companies.detail(
          fixtures.company.investigationLimited.id
        )}/exports`
      )
    })

    it('should not display a badge', () => {
      cy.get(companyLocalHeader.badge).should('not.exist')
    })

    it('should not display an "What does this mean?" details', () => {
      cy.get(companyLocalHeader.metaList).should('not.exist')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.investigationLimited.id)
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
          companies.exports.history.index(
            fixtures.company.investigationLimited.id
          )
        )
      })

      testBreadcrumbs({
        Home: dashboard(),
        Companies: companies.index(),
        [fixtures.company.investigationLimited.name]: companies.detail(
          fixtures.company.investigationLimited.id
        ),
        Exports: companies.exports.index(
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
        cy.get(companyLocalHeader.address).contains(
          'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
        )
      })

      it('should display the correct buttons', () => {
        cy.contains('Add to or remove from lists').should(
          'have.attr',
          'href',
          `${companies.lists.addRemove(
            fixtures.company.investigationLimited.id
          )}?returnUrl=${companies.detail(
            fixtures.company.investigationLimited.id
          )}/exports/history`
        )
      })

      it('should not display a badge', () => {
        cy.get(companyLocalHeader.badge).should('not.exist')
      })

      it('should not display an "What does this mean?" details', () => {
        cy.get(companyLocalHeader.metaList).should('not.exist')
      })

      it('should display the correct description', () => {
        cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
      })

      it('should display the link to the full business details', () => {
        cy.contains('View full business details').should(
          'have.attr',
          'href',
          companies.businessDetails(fixtures.company.investigationLimited.id)
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
      cy.visit(companies.orders(fixtures.company.investigationLimited.id))
    })

    testBreadcrumbs({
      Home: dashboard(),
      Companies: companies.index(),
      [fixtures.company.investigationLimited.name]: companies.detail(
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
      cy.get(companyLocalHeader.address).contains(
        'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
      )
    })

    it('should display the correct buttons', () => {
      cy.contains('Add to or remove from lists').should(
        'have.attr',
        'href',
        `${companies.lists.addRemove(
          fixtures.company.investigationLimited.id
        )}?returnUrl=${companies.detail(
          fixtures.company.investigationLimited.id
        )}/orders`
      )
    })

    it('should not display a badge', () => {
      cy.get(companyLocalHeader.badge).should('not.exist')
    })

    it('should not display an "What does this mean?" details', () => {
      cy.get(companyLocalHeader.metaList).should('not.exist')
    })

    it('should display the correct description', () => {
      cy.get(companyLocalHeader.description.paragraph(1)).should('not.exist')
    })

    it('should display the link to the full business details', () => {
      cy.contains('View full business details').should(
        'have.attr',
        'href',
        companies.businessDetails(fixtures.company.investigationLimited.id)
      )
    })

    it('should display the investigation message', () => {
      cy.get(companyLocalHeader.investigationMessage).contains(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      )
    })
  })
})
