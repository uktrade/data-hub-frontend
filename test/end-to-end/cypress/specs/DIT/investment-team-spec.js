const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')
const {
  clickButton,
  selectFirstMockedTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')
const {
  assertFlashMessage,
  assertGovReactTable,
} = require('../../../../functional/cypress/support/assertions')

const teamSelectors = selectors.investment.team

const testSubForm = ({ selector, header, checkForm, expectedResults }) => {
  cy.get(teamSelectors[selector].button).click()
  cy.get('[data-test="field-edit-team-members"]').contains('legend', header)

  checkForm()

  clickButton('Save')
  assertFlashMessage('Investment details updated')

  assertGovReactTable({
    element: teamSelectors[selector].table,
    rows: expectedResults,
  })
}

describe('Investment team', () => {
  before(() => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()
    cy.loadFixture([investmentProject])
    cy.visit(investments.projects.team(investmentProject.pk))
  })

  it('should allow updates to the team members', () => {
    testSubForm({
      selector: 'teamMembers',
      header: 'Assign project specialist and team members',
      checkForm: () => {
        selectFirstMockedTypeaheadOption({
          element: '[data-test="field-adviser_0"]',
          input: 'Jenny',
          mockAdviserResponse: false,
        })
        cy.get('[data-test="field-role_0"]').find('input').type('Test role')
      },
      expectedResults: [
        ['Role', 'Adviser', 'Team'],
        [
          'Test role',
          'Jenny Carey',
          'IG - Specialists - Knowledge Intensive Industry',
        ],
      ],
    })
  })
})
