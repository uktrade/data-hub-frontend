const { assertBreadcrumbs } = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')

const EXPECTED_NAME = 'Andy Pipkin'
const EXPECTED_TEAM = 'Andy & Lou'

const addOrReplaceTestCase = ({
  companyId,
  companyName,
  name,
  team,
  replace = false,
}) =>
  it(`Should render "${replace ? 'replace' : 'add'} a lead adviser" ${
    !team && replace ? 'with no team' : ''
  }`, () => {
    cy.visit(urls.companies.advisers.assign(companyId))

    const headline = replace
      ? 'Replace the Lead ITA'
      : 'Add someone as the Lead ITA'

    assertBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [companyName]: urls.companies.detail(companyId),
      [replace ? 'Replace the Lead ITA' : 'Add Lead ITA']: undefined,
    })

    cy.get('h1').contains(headline)
    cy.get('main')
      .should('have.attr', 'role', 'main')
      .should('have.id', 'main-content')
      .then(($el) => {
        replace &&
          cy
            .wrap($el)
            .find('> div')
            .contains('You would replace Lead ITA:')
            .parent()
            .next()
            .contains('Name: ' + name + 'Team: ' + team)
            .parents('main')
      })
      .find('form > div')
      .eq(0)
      .find('label')
      .contains('Select an ITA')
      .next()
      .contains('Who should be the primary point of contact?')
      .next()
      .find('div')
      .as('typeahead')
      .contains('-- Select ITA --')
      .parents('form')
      .find('h2')
      .contains('What happens next')
      .next()
      .as('list')
      .should('have.prop', 'tagName', 'UL')
      .find('li')
      .contains(
        'The lead ITA’s name and team will be shown on the company record page and on the lead ITA tab.'
      )
      .next()
      .contains(
        'This will replace all lead ITAs added on any subsidiaries of this company.'
      )
      .next()
      .contains('Other ITAs can replace or remove this lead ITA at any time.')
      .parent()
      .next()
      .contains(
        'When adding someone else as the Lead ITA, send the person an email to notify them. Data Hub does not send notications.'
      )

    cy.get('@list')
      .next()
      .next()
      .next()
      .find('button')
      .as('submit')
      .contains('Add Lead ITA')
      .next()
      .as('cancel')
      .contains('Cancel')
      .should('have.attr', 'href', urls.companies.advisers.index(companyId))
  })

describe('Manage Lead ITA', () => {
  addOrReplaceTestCase({
    companyId: 'not-managed',
    companyName: 'Not Managed Company',
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

  context('When submitted with no adviser is selected', () => {
    it('Should display errors', () => {
      cy.visit(urls.companies.advisers.assign('managed'))
      cy.get('form button').click()
      cy.get('form div').contains('There is a problemSelect an ITA')
      cy.get('#field-dit_participants').contains('Select an ITA')
    })
  })

  it(`Should render the remove page`, () => {
    const HEADLINE = 'Remove the Lead ITA'
    const COMPANY_NAME = 'Managed Company'
    const COMPANY_ID = 'managed'

    cy.visit(urls.companies.advisers.remove('managed'))

    assertBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [COMPANY_NAME]: urls.companies.detail(COMPANY_ID),
      [HEADLINE]: undefined,
    })

    cy.get('h1').contains(HEADLINE)

    cy.get('main')
      .should('have.attr', 'role', 'main')
      .should('have.id', 'main-content')
      .find('p')
      .contains('This will remove the current Lead ITA')
      .parent()
      .next()
      .contains('Name: ' + EXPECTED_NAME + 'Team: ' + EXPECTED_TEAM)
      .next()
      .contains('What happens next?')
      .should('have.prop', 'tagName', 'H2')
      .next()
      .should('have.prop', 'tagName', 'UL')
      .find('li')
      .contains(
        'This company will no longer show a Lead ITA ' +
          'as the first point of contact'
      )
      .next()
      .contains(
        'This will also remove the Lead ITAs on any subsidiaries of this company'
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
  })
})
