const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')
const {
  clickButton,
  selectFirstAdvisersTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')
const {
  assertFlashMessage,
} = require('../../../../functional/cypress/support/assertions')

const teamSelectors = selectors.investment.team

const assertTable = ({ element, headings, rows }) => {
  cy.get(element).as('table')

  if (headings) {
    cy.get('@table')
      .find('th')
      .each((el, i) => {
        cy.wrap(el).should('have.text', headings[i])
      })
  }

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

const testSubForm = ({ selector, header, checkForm, expectedResults }) => {
  cy.get(teamSelectors[selector].button).click()
  cy.get('[data-test="field-edit-team-members"]').contains('legend', header)

  checkForm()

  clickButton('Save and return')
  assertFlashMessage('Changes saved')

  assertTable({
    element: teamSelectors[selector].table,
    headings: ['Role', 'Adviser', 'Team'],
    rows: expectedResults,
  })
}

describe('Investment team', () => {
  it('should display investment project team', () => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()
    cy.loadFixture([investmentProject])
    cy.visit(investments.projects.team(investmentProject.pk))
  })

  it('should allow updates to the team members', () => {
    testSubForm({
      selector: 'teamMembers',
      header: 'Assign project specialist and team members',
      checkForm: () => {
        selectFirstAdvisersTypeaheadOption({
          element: '[data-test="field-adviser_0"]',
          input: 'Jenny',
        })
        cy.get('[data-test="field-role_0"]').find('input').type('Test role')
      },
      expectedResults: [
        [
          'Test role',
          'Jenny Carey',
          'IG - Specialists - Knowledge Intensive Industry',
        ],
      ],
    })
  })
})
