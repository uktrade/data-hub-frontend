/**
 * @deprecated
 * THE LOGIC IN THIS FILE HAS BEEN MOVED TO THE /test/support FOLDER AS THE LOGIC IS SHARED BETWEEN
 *  THE COMPONENT AND FUNCTIONAL TESTS. THIS FILE IS ONLY HERE TO AVOID BREAKING ANY TESTS, NO
 * ADDITIONAL LOGIC SHOULD BE ADDED
 */

const { assertBreadcrumbs } = require('./assertions')
const urls = require('../../../../src/lib/urls')

/**
 * @deprecated Use the version in /test/support folder
 */
const getCollectionList = () => {
  cy.get('[data-test="collection-list"]').as('collectionList')
  cy.get('[data-test="collection-item"]').as('collectionItems')
  cy.get('@collectionItems').eq(0).as('firstListItem')
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertCollectionBreadcrumbs = (pageName) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      [pageName]: null,
    })
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertCompanyCollectionBreadcrumbs = (companyFixture, pageName) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [companyFixture.name]: urls.companies.detail(companyFixture.id),
      [pageName]: null,
    })
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertAddItemButton = (buttonText, link) => {
  cy.get('[data-test="add-collection-item-button"]')
    .should('exist')
    .should('contain', buttonText)
    .should('have.attr', 'href', link)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertAddItemButtonNotPresent = () => {
  cy.get('[data-test="add-collection-item-button"]').should('not.exist')
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertBadge = (item, badgeText) => {
  cy.get(item).find('[data-test="badge"]').should('contain', badgeText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertTag = (item, badgeText) => {
  cy.get(item)
    .find('[data-test="collection-item-tag"]')
    .should('contain', badgeText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertBadgeNotPresent = (item, badgeText) => {
  cy.get(item).find('[data-test="badge"]').should('not.contain', badgeText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertTagNotPresent = (item, badgeText) => {
  cy.get(item)
    .find('[data-test="collection-item-tag"]')
    .should('not.contain', badgeText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertBadgeShouldNotExist = (item) => {
  cy.get(item).find('[data-test="badge"]').should('not.exist')
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertTagShouldNotExist = (item) => {
  cy.get(item).find('[data-test="collection-item-tag"]').should('not.exist')
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertMetadataItem = (item, metadataText) => {
  cy.get(item).find('[data-test="metadata"]').should('contain', metadataText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertMetadataItemNotPresent = (item, metadataText) => {
  cy.get(item)
    .find('[data-test="metadata"]')
    .should('not.contain', metadataText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertRemoveAllFiltersNotPresent = () => {
  it('should not render a "Remove all filters" button', () => {
    cy.get('[data-test="clear-filters"]').should('not.exist')
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertListLength = (fakeList) => {
  cy.get('[data-test="collection-list"]').should('have.length', 1)
  cy.get('[data-test="collection-item"]').should('have.length', fakeList.length)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertItemLink = (item, linkText, link) => {
  cy.get(item)
    .find('h3')
    .children()
    .should('have.text', linkText)
    .should('have.attr', 'href', link)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertArchiveSummary = (type) => {
  const message =
    type === 'contact'
      ? 'Why can I not add a ' + type + '?'
      : 'Why can I not add an ' + type + '?'
  it('should render the archived summary', () => {
    cy.get('[data-test="archived-details"]').should('contain', message)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertArchiveMessage = (type) => {
  const message = type + ' cannot be added to an archived company.'
  it('should render an archived explanation', () => {
    cy.get('[data-test="archived-details"]').should('contain', message)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertUnarchiveLink = (url) => {
  it('should render "Click here to unarchive"', () => {
    cy.get('[data-test="archived-details"]')
      .find('a')
      .should('have.text', 'Click here to unarchive')
      .should('have.attr', 'href', url)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertUpdatedOn = (item, text) => {
  cy.get(item).find('h4').should('have.text', text)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertRole = (roleType) => {
  it('should contain a status role', () => {
    cy.get(`[role="${roleType}"]`).should('exist')
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertTitle = (headingText) => {
  it('should render a title', () => {
    cy.get('h2').should('contain', headingText)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertPaginationSummary = (pageText) => {
  cy.get('[data-test=pagination-summary]').contains(pageText)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertOMISSumary = (summaryText) => {
  it('should have the total value', () => {
    cy.get('[data-test="summary"]')
      .should('exist')
      .should('contain', summaryText)
  })
}

module.exports = {
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertCompanyCollectionBreadcrumbs,
  assertAddItemButton,
  assertAddItemButtonNotPresent,
  assertBadge,
  assertBadgeNotPresent,
  assertMetadataItem,
  assertMetadataItemNotPresent,
  assertRemoveAllFiltersNotPresent,
  assertListLength,
  assertItemLink,
  assertArchiveSummary,
  assertArchiveMessage,
  assertUnarchiveLink,
  assertUpdatedOn,
  assertRole,
  assertTitle,
  assertBadgeShouldNotExist,
  assertPaginationSummary,
  assertOMISSumary,
  assertTag,
  assertTagNotPresent,
  assertTagShouldNotExist,
}
