const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')

const teamSelectors = selectors.investment.team

const selectTypeahead = (field, input) =>
  cy.get(field).within(() => {
    cy.server()
    cy.route('/api/options/adviser?*').as('adviserResults')
    cy.get('.multiselect__tags').type(input)
    cy.wait('@adviserResults')
    cy.get('.multiselect__content-wrapper').contains(input).click()
  })

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
  cy.get(teamSelectors[selector].header).should('have.text', header)

  checkForm()

  cy.get(teamSelectors[selector].save).click()
  cy.get(teamSelectors.flash).should(
    'have.text',
    'Investment details updatedDismiss'
  )

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
        cy.get(teamSelectors.removeMethod).click()
        cy.get(teamSelectors.addTypeahead).click()
        selectTypeahead(teamSelectors.teamMembers.typeahead, 'Jenny')
        cy.get(teamSelectors.teamMembers.teamRole)
          .click()
          .clear()
          .type('Test role')
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
