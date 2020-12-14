const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures/index')

describe('Update the project stage', () => {
  context('When viewing a project details page', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should display the admin button', () => {
      cy.contains('Admin')
    })
    it('should render the admin page when the Admin tab is clicked', () => {
      cy.contains('Admin').click()
      cy.url().should(
        'contain',
        urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
      )
    })
  })
  context('When viewing a project admin page', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should render the header', () => {
      assertLocalHeader('Change the project stage')
    })
    it('should display breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixtures.investment.newHotelFdi
          .name]: urls.investments.projects.project(
          fixtures.investment.newHotelFdi.id
        ),
        Admin: null,
      })
    })
    it('should display the project name and current stage under "Project details"', () => {
      cy.contains('h2', 'Project details')
      cy.contains('p', `Project name: ${fixtures.investment.newHotelFdi.name}`)
      cy.contains('p', 'Current stage: Assign PM')
    })
    it('should display heading and radio buttons for the remaining four stages', () => {
      cy.contains('h2', 'Change the stage to')
      cy.get('label').eq(0).should('contain', 'Prospect')
      cy.get('label').eq(1).should('contain', 'Active')
      cy.get('label').eq(2).should('contain', 'Verify win')
      cy.get('label').eq(3).should('contain', 'Won')
    })
    it('should display the "Save" button', () => {
      cy.contains('button', 'Save')
    })
    it('should display the "Cancel" link', () => {
      cy.contains('a', 'Cancel')
    })
  })
  context('When clicking the "Cancel" link', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should take you back to the project details page', () => {
      cy.contains('a', 'Cancel').click()
      cy.url().should(
        'contain',
        urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
      )
    })
  })
  context(
    'When the "Save" button is clicked without selecting a new stage',
    () => {
      before(() => {
        cy.visit(
          urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
        )
      })
      it('should display an error message', () => {
        cy.contains('button', 'Save').click()
        cy.contains('h2', 'There is a problem')
          .next()
          .should('have.text', 'Select a new stage')
        cy.contains('div', 'Prospect').should('contain', 'Select a new stage')
      })
    }
  )
  context(
    'When the "Save" button is clicked after selecting a new stage',
    () => {
      before(() => {
        cy.visit(
          urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
        )
      })
      it('should take you to project details page and display a flash message', () => {
        cy.get('label').eq(0).click()
        cy.contains('button', 'Save').click()
        cy.url().should(
          'contain',
          urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
        )
        cy.contains('div', 'Project stage saved')
      })
      it('should no longer show the flash message when the page is refreshed', () => {
        cy.reload()
        cy.contains('div', 'Project stage saved').should('not.exist')
      })
    }
  )
})
