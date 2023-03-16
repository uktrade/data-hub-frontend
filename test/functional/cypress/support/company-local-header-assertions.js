// Assertions for the CompanyLocalHeader tests

const selectors = require('../../../selectors')
const { testBreadcrumbs } = require('./assertions')
const urls = require('../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

/**
 * Assert that the company name appears correctly
 */
const assertCompanyName = (companyName) => {
  cy.get(companyLocalHeader.companyName).contains(companyName)
}

/**
 * Assert that the company address appears correctly
 */
const assertCompanyAddress = (address) => {
  cy.get(companyLocalHeader.address).contains(address)
}

/**
 * Asserts the text that appears on the HQ type badge (Global, Ultimate etc)
 */
const assertBadgeText = (badgeText) => {
  cy.get(companyLocalHeader.badge).contains(badgeText)
}

/**
 * Asserts that the add/remove from list button has the correct URL
 */
const assertButtons = (url) => {
  cy.contains('View options').click()
  cy.contains('Add to or remove from lists').should('have.attr', 'href', url)
}

/**
 * Asserts that the add interaction button has the correct URL
 */
const assertAddInteractionButton = (url) => {
  cy.get('[data-test="header-add-interaction"]')
    .click()
    .should('have.attr', 'href', url)
  cy.go('back')
}

/**
 * Asserts that the header breadcrumbs appear correctly
 */
const assertBreadcrumbs = (companyName, detailsUrl, lastCrumb) => {
  testBreadcrumbs({
    Home: urls.dashboard(),
    Companies: urls.companies.index(),
    [companyName]: detailsUrl,
    [lastCrumb]: null,
  })
}

/**
 * This page has a different breadcrumb layout so needs its own assertion.
 */
const assertExportCountryHistoryBreadcrumbs = (company, detailsUrl) => {
  testBreadcrumbs({
    Home: urls.dashboard(),
    Companies: urls.companies.index(),
    [company.name]: detailsUrl,
    Exports: urls.companies.exports.index(company.id),
    'Export countries history': null,
  })
}

const assertOneListTierA = (paragraphNumber) => {
  cy.get(companyLocalHeader.description.paragraph(paragraphNumber)).contains(
    'This is an account managed company (One List Tier A - Strategic Account)'
  )
}

const assertCoreTeam = (paragraphNumber, advisersUrl) => {
  cy.get(companyLocalHeader.description.paragraph(paragraphNumber))
    .contains('Global Account Manager: Travis Greene View core team')
    .contains('View core team')
    .should('have.attr', 'href', advisersUrl)
}

const assertArchivePanelNotVisible = () => {
  cy.get('[data-test-archive-panel]').should('not.exist')
}

module.exports = {
  assertCompanyName,
  assertCompanyAddress,
  assertBadgeText,
  assertButtons,
  assertAddInteractionButton,
  assertBreadcrumbs,
  assertExportCountryHistoryBreadcrumbs,
  assertOneListTierA,
  assertCoreTeam,
  assertArchivePanelNotVisible,
}
