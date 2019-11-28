const { assertBreadcrumbs } = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')

const testCase = ({ companyId, companyName, replace }) =>
  it(`Should render the ${replace ? 'replace' : 'add'} variant`, () => {
    cy.visit(urls.companies.advisers.assign(companyId))

    const headline = replace
      ? 'Replace the Lead ITA'
      : 'Confirm you are the Lead ITA'

    assertBreadcrumbs({
      'Home': '/',
      'Companies': '/companies',
      [companyName]: `/companies/${companyId}`,
      [headline]: undefined,
    })

    cy.get('h1')
      .contains(headline)

    cy.get('main')
      .children()
      .first()
      .get('h3').as('h3').eq(0).as('question')
      .contains('Do you want to add yourself as the first point of contact?')
      .then($el =>
        replace && cy
          .get($el)
          .next()
          .contains('You would replace Lead ITA:')
          .next()
          .contains(
            'Name: Andy Pipkin' +
            'Team: Little Britain'
          )
      )
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

    // Test interaction
    cy.get('@detail-summary')
      .click()

    cy.get('@detail-content')
      .should('be.visible')

    cy.get('@submit')
      .click()

    cy.get('[role="alert"]')
      .contains('Lead adviser information updated')
  })

describe('Lead ITA page', () => {
  testCase({
    companyId: 'not-managed',
    companyName: 'Not Managed Company',
  })
  testCase({
    companyId: 'managed',
    companyName: 'Managed Company',
    replace: true,
  })
})
