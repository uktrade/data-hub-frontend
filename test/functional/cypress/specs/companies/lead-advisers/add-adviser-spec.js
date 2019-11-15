const fixtures = require('../../../fixtures')
const { assertBreadcrumbs } = require('../../../support/utils')

const url = `/companies/${fixtures.company.lambdaPlc.id}/advisers/add`

describe('Add Adviser', () => {
  it('Should display the add Lead ITA confirmation page', () => {
    cy.visit(url)

    assertBreadcrumbs({
      'Home': '/',
      'Companies': '/companies',
      'Lambda plc': '/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa',
      'Confirm you are the Lead ITA': undefined,
    })

    cy.get('h1')
      .contains('Confirm you are the Lead ITA')

    cy.get('main')
      .children()
      .first()
      .get('h3').as('h3').eq(0)
      .contains('Do you want to add yourself as the first point of contact?')
      .next()
      .contains('How do I add someone else as the Lead ITA?')
      .as('detail-summary')

    cy.get('@h3').eq(1)
      .contains('What happens next?')
      .next()
      .as('list')
      .should($element => expect($element.prop('tagName')).to.equal('UL'))
      .find('li')
      .contains(
        'Your name and team will be displayed on top of the company page, ' +
        'as well as in the Lead Adviser tab'
      )
      .next()
      .contains(
        'This will also replace Lead ITAs set on ' +
        'any subsidiaries of this company'
      )
      .next()
      .contains(
        'Other ITAs will be able to replace you as the Lead ITA for the company'
      )

    cy.get('@list')
      .next()
      .contains('Add myself as Lead ITA')
      .as('submit')
      .next()
      .contains('Cancel')

    cy
      .contains(
        'You can only add yourself as the Lead ITA. If you think another ' +
        'International Trade Adviser is the first point of contact for this ' +
        'company, they will need to add themselves.'
      )
      .as('detail-content')
      .should('not.be.visible')

    cy.get('@detail-summary')
      .click()

    cy.get('@detail-content')
      .should('be.visible')

    cy.get('@submit')
      .click()

    cy.get('[role="alert"]')
      .contains('Lead adviser information updated')
  })
})
