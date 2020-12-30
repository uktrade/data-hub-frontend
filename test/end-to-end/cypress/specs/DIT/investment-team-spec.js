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
  before(() => {
    cy.visit(
      investments.projects.team(
        fixtures.investmentProject.fancyDressManufacturing.id
      )
    )
  })

  it('should allow certain edits to the Client relationship management team', () => {
    testSubForm({
      selector: 'clientRelationship',
      header: 'Edit client relationship management',
      checkForm: () => {
        selectTypeahead(teamSelectors.clientRelationship.typeahead, 'Barry')
        cy.get(teamSelectors.clientRelationship.globalSummary).click()
        cy.get(teamSelectors.clientRelationship.globalContents).should(
          'not.be.hidden'
        )
      },
      expectedResults: [
        [
          'Client Relationship Manager',
          'Barry Oling',
          'Isle of Wight Chamber of Commerce',
        ],
        [
          'Global Account Manager',
          'Travis Greene',
          'IST - Sector Advisory Services',
        ],
      ],
    })
  })

  it('should allow updates to the Project management team', () => {
    testSubForm({
      selector: 'projectManagement',
      header: 'Assign project management',
      checkForm: () => {
        assertTable({
          element: teamSelectors.projectManagement.projectInfo,
          rows: [
            ['Primary sector', 'Renewable Energy : Wind : Onshore'],
            ['Client company', 'One List Corp'],
            ['Website', ''],
            ['Account tier', 'Tier A - SRM Programme Accounts'],
            ['Possible UK locations', 'North East'],
            ['Competitor countries', ''],
            ['Estimated land date', ''],
            ['Total investment', '£1,000,000.00'],
          ],
        })
        selectTypeahead(
          teamSelectors.projectManagement.assuranceTypeahead,
          'Paula'
        )
        selectTypeahead(teamSelectors.projectManagement.pmTypeahead, 'Harold')
      },
      expectedResults: [
        [
          'Project Assurance Adviser',
          'Paula Churing',
          'Marketing - Marketing Team',
        ],
        [
          'Project Manager',
          'Harold Jones',
          'International Trade Team Business Link North Manchester (Wigan, Bolton, Bury, Oldham and Rochdale)',
        ],
      ],
    })
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
