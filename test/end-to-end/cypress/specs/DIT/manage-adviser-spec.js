const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

let company

const addOrReplaceTestCase = ({
  headline,
  option,
  successMessage,
  replace,
}) => {
  it(`should be able to ${replace ? 'replace' : 'add'} an adviser`, () => {
    cy.visit(urls.companies.accountManagement.index(company.pk))
    cy.get(`[data-test="${replace ? 'replace' : 'add'}-ita-button"]`)
      .contains(`${replace ? 'Replace Lead ITA' : 'Add a Lead ITA'}`)
      .click()
    cy.get('h1').contains(headline)
    cy.get('form label')
      .parent()
      .next()
      .next()
      .selectTypeaheadOption(option)
      .parents('form')
      .find('button')
      .click()
    cy.get(selectors.companyLocalHeader().flashMessageList).should(
      'have.text',
      successMessage
    )
  })
}

xdescribe('Manage Lead ITA', () => {
  company = fixtures.company.create.lambda()
  before(() => {
    cy.loadFixture([company]).debug()
  })

  addOrReplaceTestCase({
    headline: 'Add someone as the Lead ITA',
    option: 'Harold',
    successMessage:
      "Lead adviser information updated.Send Harold Jones an email to let them know they've been made Lead ITA.",
    replace: false,
  })
  addOrReplaceTestCase({
    headline: 'Replace the Lead ITA',
    option: 'Sarah',
    successMessage:
      "Lead adviser information updated.Send Sarah Gates an email to let them know they've been made Lead ITA.",
    replace: true,
  })

  it('should not be able to add an advisor who is no longer active', () => {
    cy.visit(urls.companies.accountManagement.index(company.pk))
    cy.get('[data-test="replace-ita-button"]')
      .contains('Replace Lead ITA')
      .click()
    cy.get('form label')
      .parent()
      .next()
      .next()
      .checkNoTypeaheadOptionsDisplayed('Ava')
  })

  it('should be able to remove an adviser', () => {
    cy.visit(urls.companies.accountManagement.index(company.pk))
    cy.get('[data-test="remove-ita-button"]').click()
    cy.get('form button').click()
    cy.get(selectors.companyLocalHeader().flashMessageList).contains(
      'Lead adviser information updated'
    )
  })
})
