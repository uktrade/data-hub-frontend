import { investments } from '../../../../../src/lib/urls'
import { investmentProjectFaker } from '../../fakers/investment-projects'
import {
  assertBreadcrumbs,
  assertFieldRadiosWithoutLabel,
  assertLocalHeader,
} from '../../support/assertions'

describe('EditProjectStatus', () => {
  const project = investmentProjectFaker({
    status: 'ongoing',
    stage: 'prospect',
    specificProgrammes: [],
  })

  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v3/investment/${project.id}`, {
      statusCode: 200,
      body: project,
    }).as('getProjectDetails')
    cy.intercept('PATCH', `/api-proxy/v3/investment/${project.id}`, (req) => {
      // manually add stage to request object to bypass validation that on sandbox
      // endpoint that is not applicable for projects at a prospect stage
      req.body.stage = project.stage
    }).as('editStatusRequest')
    cy.visit(investments.projects.status(project.id))
    cy.wait('@getProjectDetails')
  })
  context('When on the Change project status page', () => {
    it('should render the header', () => {
      assertLocalHeader('Change project status')
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        Projects: investments.projects.index(),
        [project.name]: investments.projects.details(project.id),
        'Change project status': null,
      })
    })

    it('should display radio buttons with the current status radio selected', () => {
      cy.get('[data-test="field-status"]').then((element) => {
        assertFieldRadiosWithoutLabel({
          element,
          value: 'Ongoing',
          optionsCount: 6,
        })
      })
    })

    it('should render a Save and Back button', () => {
      cy.get('[data-test="submit-button"]')
        .should('exist')
        .and('have.text', 'Save')
      cy.get('[data-test="cancel-button"]')
        .should('exist')
        .and('have.attr', 'href', `/investments/projects/${project.id}/details`)
        .and('have.text', 'Back')
    })
  })

  context('When selecting another radio button and pressing save', () => {
    it('should send the updated data and return to the details page with flash message', () => {
      cy.get('[data-test="status-referred"]').click()
      cy.get('[data-test="submit-button"]').click()
      cy.wait('@editStatusRequest').its('request.body').should('include', {
        status: 'referred',
      })
      cy.url().should('contain', investments.projects.details(project.id))
      cy.get('[data-test="status-message"]')
        .should('exist')
        .and('have.text', 'Investment status updated')
    })

    it('should go back to the details page when clicking back and not show a flash message', () => {
      cy.get('[data-test="cancel-button"]').click()
      cy.url().should('contain', investments.projects.details(project.id))
      cy.get('[data-test="status-message"]').should('not.exist')
    })
  })
})
