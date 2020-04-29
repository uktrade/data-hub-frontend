const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')
const projectLandingBeforeApril = require('../../fixtures/investment/investment-land-date-before-April-2020.json')
const projectLandingAfterApril = require('../../fixtures/investment/investment-land-date-after-April-2020.json')
const projectNoLandingDates = require('../../fixtures/investment/investment-no-landing-dates.json')

describe('Edit the value details of a project', () => {
  context(
    'When either actual or estimated land date is before 01/04/2020 ',
    () => {
      before(() => {
        cy.visit(investments.projects.details(projectLandingBeforeApril.id))
        cy.contains('Edit value').click()
      })
      it('should render the header', () => {
        assertLocalHeader(projectLandingBeforeApril.name)
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Investments: '/investments',
          Projects: investments.projects.index(),
          [projectLandingBeforeApril.name]: investments.projects.project(
            projectLandingBeforeApril.id
          ),
          'Edit value': null,
        })
      })
      it('should display the Project Value field on the edit value page', () => {
        cy.contains('Project value').should('be.visible')
      })
    }
  )
  context(
    'When either actual or estimated land date is after 01/04/2020 ',
    () => {
      before(() => {
        cy.visit(investments.projects.details(projectLandingAfterApril.id))
        cy.contains('Edit value').click()
      })
      it('should not display the Project Value field on the edit value page', () => {
        cy.contains('label', 'Project value').should('not.be.visible')
      })
    }
  )
  context('When both land date fields are empty', () => {
    before(() => {
      cy.visit(investments.projects.details(projectNoLandingDates.id))
      cy.contains('Edit value').click()
    })
    it('should not display the Project Value field on the edit value page', () => {
      cy.contains('label', 'Project value').should('not.be.visible')
    })
  })
})
