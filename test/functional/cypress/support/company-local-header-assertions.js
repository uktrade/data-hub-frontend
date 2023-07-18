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
 * Asserts that the add to list button has the correct URL
 */
const assertAddButton = (addRemoveFromListUrl, detailsUrl) => {
  cy.get('[data-test="add-to-list-button"]').contains('+ Add to list')
  cy.get('[data-test="add-to-list-button"]').click()
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(addRemoveFromListUrl)
    expect(loc.search).contains(detailsUrl)
  })
  cy.go('back')
}

/**
 * Asserts that the company trading name appears correctly
 */
const assertCompanyTradingName = (tradingName) => {
  cy.get('[data-test="trading-name"]').contains(tradingName)
}

/**
 * Asserts that the company trading name is not visible
 */
const assertCompanyTradingNameNotVisible = () => {
  cy.get('[data-test="trading-name"]').should('not.exist')
}

/**
 * Asserts that the refer this compnay button has the correct URL
 */
const assertReferButton = (referralUrl) => {
  cy.get('[data-test="refer-company-button"]').contains('Refer this company')
  cy.get('[data-test="refer-company-button"]').click()
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(referralUrl)
  })
  cy.go('back')
}

/**
 * Asserts that the company list item button has the correct URL
 */
const assertCompanyListItemButton = (addRemoveFromListUrl, detailsUrl) => {
  cy.get('[data-test="list-item-list-c-button"]').contains('List C')
  cy.get('[data-test="list-item-list-c-button"]').click()
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(addRemoveFromListUrl)
    expect(loc.search).contains(detailsUrl)
  })
  cy.go('back')
}

/**
 * Asserts that the add export project button has the correct URL
 */
const assertExportProjectButton = (url) => {
  cy.contains('Add export project').should('have.attr', 'href', url)
}

/**
 * Asserts that the add interaction button has the correct URL
 */
const assertAddInteractionButton = (url) => {
  cy.get('[data-test="header-add-interaction"]').should(
    'have.attr',
    'href',
    url
  )
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
  assertAddButton,
  assertReferButton,
  assertExportProjectButton,
  assertAddInteractionButton,
  assertBreadcrumbs,
  assertExportCountryHistoryBreadcrumbs,
  assertOneListTierA,
  assertCoreTeam,
  assertArchivePanelNotVisible,
  assertCompanyListItemButton,
  assertCompanyTradingName,
  assertCompanyTradingNameNotVisible,
}
