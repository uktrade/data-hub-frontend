const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

const projectWithCompleteTeam = require('../../fixtures/investment/investment-complete-team.json')
const projectWithGlobalManager = require('../../fixtures/investment/investment-with-global-account-manager.json')
const prospectProject = require('../../fixtures/investment/investment-has-existing-details.json')

const investmentTeams = require('../../fixtures/investment/investment-teams.json')
const globalAccountManager = require('../../fixtures/investment/investment-global-manager.json')

const assertTable = ({ element, rows }) => {
  cy.get(element).as('table')

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

const assertViewHeader = ({ project }) => {
  it('should render the header', () => {
    assertLocalHeader(project.name)
  })
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Investments: investments.index(),
      Projects: investments.projects.index(),
      [project.name]: investments.projects.details(project.id),
      'Project team': null,
    })
  })
}

describe('Viewing the team of a project', () => {
  context('When viewing a project with existing team data', () => {
    before(() => {
      cy.visit(investments.projects.details(projectWithCompleteTeam.id))
      cy.get('[data-test="project-team-link"]').click()
    })

    assertViewHeader({ project: projectWithCompleteTeam })

    it('should display expected data', () => {
      cy.get('[data-test="crm-heading"]').should(
        'have.text',
        'Client relationship management'
      )

      assertTable({
        element: '[data-test="crm-table"]',
        rows: [
          ['Role', 'Adviser', 'Team'],
          [
            'Client Relationship Manager',
            projectWithCompleteTeam.client_relationship_manager.name,
            projectWithCompleteTeam.client_relationship_manager_team.name,
          ],
        ],
      })

      cy.get('[data-test="edit-crm-button"]').should('exist')
      cy.get('[data-test="add-crm-button"]').should('not.exist')

      cy.get('[data-test="pm-heading"]').should(
        'have.text',
        'Project management'
      )

      assertTable({
        element: '[data-test="pm-table"]',
        rows: [
          ['Role', 'Adviser', 'Team'],
          [
            'Project Assurance Adviser',
            projectWithCompleteTeam.project_assurance_adviser.name,
            projectWithCompleteTeam.project_assurance_team.name,
          ],
          [
            'Project Manager',
            projectWithCompleteTeam.project_manager.name,
            projectWithCompleteTeam.project_manager_team.name,
          ],
        ],
      })
      cy.get('[data-test="edit-pm-button"]').should('exist')
      cy.get('[data-test="add-pm-button"]').should('not.exist')

      cy.get('[data-test="team-heading"]').should(
        'have.text',
        'Project specialist and team members'
      )

      assertTable({
        element: '[data-test="team-table"]',
        rows: [
          ['Role', 'Adviser', 'Team'],
          [
            projectWithCompleteTeam.team_members[0].role,
            projectWithCompleteTeam.team_members[0].adviser.name,
            investmentTeams[projectWithCompleteTeam.team_members[0].adviser.id],
          ],
          [
            projectWithCompleteTeam.team_members[1].role,
            projectWithCompleteTeam.team_members[1].adviser.name,
            investmentTeams[projectWithCompleteTeam.team_members[1].adviser.id],
          ],
        ],
      })
      cy.get('[data-test="edit-team-button"]').should('exist')
      cy.get('[data-test="add-team-button"]').should('not.exist')
    })
  })

  context('When viewing a project with a global account manager', () => {
    before(() => {
      cy.visit(investments.projects.details(projectWithGlobalManager.id))
      cy.get('[data-test="project-team-link"]').click()
    })

    assertViewHeader({ project: projectWithGlobalManager })

    it('should display expected data', () => {
      cy.get('[data-test="crm-heading"]').should(
        'have.text',
        'Client relationship management'
      )

      assertTable({
        element: '[data-test="crm-table"]',
        rows: [
          ['Role', 'Adviser', 'Team'],
          [
            'Client Relationship Manager',
            projectWithGlobalManager.client_relationship_manager.name,
            projectWithGlobalManager.client_relationship_manager_team.name,
          ],
          [
            'Global Account Manager',
            globalAccountManager.name,
            globalAccountManager.dit_team.name,
          ],
        ],
      })
    })

    it('should display the correct inset text for project management', () => {
      cy.get('[data-test="pm-inset"]').should(
        'have.text',
        'Once both a Project Manager and a Project Assurance Adviser have been assigned, the project will move to the Active stage.'
      )
    })
  })

  context('When viewing a prospect project with no project management', () => {
    before(() => {
      cy.visit(investments.projects.details(prospectProject.id))
      cy.get('[data-test="project-team-link"]').click()
    })

    it('should display the correct inset text for project management', () => {
      cy.get('[data-test="pm-prospect-inset"]').should(
        'have.text',
        'Will be assigned during the Assign PM stage.'
      )

      cy.get('[data-test="pm-inset"]').should('not.exist')
      cy.get('[data-test="add-pm-button"]').should('not.exist')
      cy.get('[data-test="edit-pm-button"]').should('not.exist')
    })
  })
})
