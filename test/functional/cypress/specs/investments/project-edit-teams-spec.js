const urls = require('../../../../../src/lib/urls')
const {
  assertBreadcrumbs,
  assertRequestBody,
  assertUrl,
  assertFlashMessage,
  assertErrorSummary,
  assertErrorDialog,
  assertAPIRequest,
} = require('../../support/assertions')
const {
  selectFirstAdvisersTypeaheadOption,
  clickButton,
  clickCancelLink,
} = require('../../support/actions')

const projectWithCompleteTeam = require('../../fixtures/investment/investment-complete-team.json')
const projectWithIncompleteTeam = require('../../fixtures/investment/investment-incomplete-team.json')

const EDIT_TEAMS_INTERCEPT = 'projectEditTeamsHttpRequest'

describe('View edit team members page', () => {
  beforeEach(() => {
    cy.intercept('PUT', '/api-proxy/v3/investment/*/team-member').as(
      EDIT_TEAMS_INTERCEPT
    )
  })

  context('When there are existing advisers and roles', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.editTeamMembers(projectWithCompleteTeam.id)
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [projectWithCompleteTeam.name]: urls.investments.projects.project(
          projectWithCompleteTeam.id
        ),
        'Project team': 'team',
        'Team members': undefined,
      })
    })

    it('should render a legend displaying a heading', () => {
      cy.get('[data-test="field-edit-team-members"]').contains(
        'legend',
        'Assign project specialist and team members'
      )
    })

    it('should render two team member controls, two members assigned', () => {
      getAllTeamMemberFields().should('have.length', 2)

      getAllTeamMemberFields()
        .eq(0)
        .find('[data-test="typeahead-input"]')
        .should('have.value', 'Jenny Carey')

      getAllTeamMemberFields()
        .eq(1)
        .find('[data-test="typeahead-input"]')
        .should('have.value', 'Dennis Kennedy')
    })

    it('should render two role inputs, two roles assigned', () => {
      getAllRoleFields().should('have.length', 2)

      getAllRoleFields()
        .eq(0)
        .find('input')
        .should('have.value', 'Sector adviser')

      getAllRoleFields()
        .eq(1)
        .find('input')
        .should('have.value', 'Region adviser')
    })
  })

  context('When there are no existing advisers and roles', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.editTeamMembers(projectWithIncompleteTeam.id)
      )
    })

    it('should render one empty team member control ready to edit', () => {
      getAllTeamMemberFields().should('have.length', 1)

      getAllTeamMemberFields()
        .eq(0)
        .find('[data-test="typeahead-input"]')
        .should('have.value', '')
    })

    it('should render one empty role control ready to edit', () => {
      getAllRoleFields().should('have.length', 1)

      getAllRoleFields().eq(0).find('input').should('have.value', '')
    })
  })

  context('When successfully saved', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.editTeamMembers(projectWithIncompleteTeam.id)
      )
    })

    it('should send correct data to backend showing success message', () => {
      const expectedBody = [
        {
          adviser: '2c42c516-9898-e211-a939-e4115bead28a',
          role: '­­Role',
        },
      ]
      selectFirstAdvisersTypeaheadOption({
        element: '[data-test="field-adviser_0"]',
        input: 'shawn',
      })
      cy.get('[data-test="field-role_0"]').find('input').type('­­Role')

      clickButton('Save and return')

      assertAPIRequest(EDIT_TEAMS_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertRedirectToProjectsTeamUrl(projectWithIncompleteTeam.id)
        assertFlashMessage('Changes saved')
      })
    })
  })

  context('When removing an item and then saving', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.editTeamMembers(projectWithCompleteTeam.id)
      )
    })

    it('should save the other records only', () => {
      const expectedBody = [
        {
          adviser: 'f1eb4363-0a37-4344-bd96-e90abeaf483e',
          role: 'Sector adviser',
        },
      ]
      removeSecondTeamMember()

      clickButton('Save and return')

      assertAPIRequest(EDIT_TEAMS_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertRedirectToProjectsTeamUrl(projectWithCompleteTeam.id)
        assertFlashMessage('Changes saved')
      })

      function removeSecondTeamMember() {
        getAllTeamMemberFields().eq(1).find('a').click()
      }
    })

    it('should not contain any null data', () => {
      const expectedBody = [
        {
          adviser: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
          role: 'Region adviser',
        },
      ]

      removeFirstTeamMember()

      clickButton('Save and return')

      assertAPIRequest(EDIT_TEAMS_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertRedirectToProjectsTeamUrl(projectWithCompleteTeam.id)
        assertFlashMessage('Changes saved')
      })

      function removeFirstTeamMember() {
        getAllTeamMemberFields().eq(0).find('a').click()
      }
    })
  })

  context('When validation fails', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.editTeamMembers(projectWithIncompleteTeam.id)
      )
    })

    it('should fail for duplicate advisers', () => {
      selectFirstAdvisersTypeaheadOption({
        element: '[data-test="field-adviser_0"]',
        input: 'shawn',
      })
      cy.get('[data-test="field-role_0"]').find('input').type('­­Role')

      clickButton('Add another team member')
      selectFirstAdvisersTypeaheadOption({
        element: '[data-test="field-adviser_1"]',
        input: 'shawn',
      })
      cy.get('[data-test="field-role_1"]').find('input').type('­­Role')

      clickButton('Save and return')

      assertErrorDialog(
        'TASK_EDIT_PROJECT_TEAM_MEMBERS',
        'You cannot add the same adviser as a team member more than once.'
      )
    })

    it('should fail for no values on role or team member', () => {
      clickButton('Save and return')

      assertErrorSummary([
        'Select at least one adviser',
        'Enter a role for the adviser',
      ])
    })
  })

  context('When returning without saving', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.editTeamMembers(projectWithIncompleteTeam.id)
      )
    })

    it('should redirects to the teams page with no changes', () => {
      clickCancelLink()

      assertRedirectToProjectsTeamUrl(projectWithIncompleteTeam.id)
    })
  })
})

function assertRedirectToProjectsTeamUrl(id) {
  assertUrl(urls.investments.projects.team(id))
}

function getAllTeamMemberFields() {
  return cy.get('[data-test^="team-member-field-"]')
}

function getAllRoleFields() {
  return cy.get('[data-test^="field-role_"]')
}
