const { assertBreadcrumbs } = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')

const EXPECTED_NAME = 'Andy Pipkin'
const EXPECTED_TEAM = 'Andy & Lou'

const selectMainContent = () =>
  cy.get('main')
    .children()
    .first()

const addOrReplaceTestCase = ({ companyId, companyName, name, team, replace }) =>
  it(`Should render the ${replace ? 'replace' : 'add'} page`, () => {
    cy.visit(urls.companies.advisers.assign(companyId))

    const headline = replace
      ? 'Replace the Lead ITA'
      : 'Confirm you are the Lead ITA'

    assertBreadcrumbs({
      'Home': urls.dashboard(),
      'Companies': urls.companies.index(),
      [companyName]: urls.companies.detail(companyId),
      [headline]: undefined,
    })

    cy.get('h1')
      .contains(headline)

    selectMainContent()
      .children()
      .first()
      .get('h3').as('h3').eq(0).as('question')
      .contains('Do you want to add yourself as the first point of contact?')
      .then($el =>
        replace && cy
          .get($el)
          .next()
          .contains('You would replace Lead ITA:')
          // We are using the govuk-react/Paragraph component,
          // in which <p> is nested in a <div> so we need to step out of it.
          .parent()
          .next()
          .contains(
            'Name: ' + name +
            'Team: ' + team
          )
      )
      .next()
      .contains('How do I add someone else as the Lead ITA?')
      .as('detail-summary')

    cy.get('@h3').eq(1)
      .contains('What happens next?')
      .next()
      .as('list')
      .should('have.prop', 'tagName', 'UL')
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
      .should('have.attr', 'href', urls.companies.advisers.index(companyId))

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

describe('Manage Lead ITA', () => {
  addOrReplaceTestCase({
    companyId: 'not-managed',
    companyName: 'Not Managed Company',
    name: EXPECTED_NAME,
    team: EXPECTED_TEAM,
  })

  addOrReplaceTestCase({
    companyId: 'managed',
    companyName: 'Managed Company',
    name: EXPECTED_NAME,
    team: EXPECTED_TEAM,
    replace: true,
  })

  addOrReplaceTestCase({
    companyId: 'managed-no-team',
    companyName: 'Managed Company With No Team',
    name: EXPECTED_NAME,
    team: '',
    replace: true,
  })

  it(`Should render the remove page`, () => {
    const HEADLINE = 'Remove the Lead ITA'
    const COMPANY_NAME = 'Managed Company'
    const COMPANY_ID = 'managed'

    cy.visit(urls.companies.advisers.remove('managed'))

    assertBreadcrumbs({
      'Home': urls.dashboard(),
      'Companies': urls.companies.index(),
      [COMPANY_NAME]: urls.companies.detail(COMPANY_ID),
      [HEADLINE]: undefined,
    })

    cy.get('h1').contains(HEADLINE)

    selectMainContent()
      .children()
      .first()
      .as('before-paragraph')
      .get('p')
      .contains('This will remove the current Lead ITA')

    cy.get('@before-paragraph')
      .next()
      .contains(
        'Name: ' + EXPECTED_NAME +
        'Team: ' + EXPECTED_TEAM
      )
      .next()
      .contains('What happens next?')
      .should('have.prop', 'tagName', 'H3')
      .next()
      .should('have.prop', 'tagName', 'UL')
      .find('li')
      .contains(
        'This company will no longer show a Lead ITA ' +
        'as the first point of contact'
      )
      .next()
      .contains(
        'This will also remove the Lead ITAs on any subsidiaries of this company',
      )
      .next()
      .contains(
        'This company and any subsidiaries will no longer be listed ' +
        'as account managed companies (Partner led accounts)'
      )
      .parent()
      .next()
      .contains('Remove the Lead ITA')
      .as('submit')
      .next()
      .contains('Cancel')
      .should('have.attr', 'href', urls.companies.advisers.index(COMPANY_ID))

    cy.get('@submit')
      .click()

    cy.get('[role="alert"]')
      .contains('Lead adviser information updated')
  })
})
