/**
 * Assertions for the various CollectionList tests
 */

const { assertBreadcrumbs } = require('./assertions')
const urls = require('../../../../src/lib/urls')

const getCollectionList = () => {
  cy.get('[data-test="collection-list"]').as('collectionList')
  cy.get('[data-test="collection-item"]').as('collectionItems')
  cy.get('@collectionItems').eq(0).as('firstListItem')
}

const assertCollectionBreadcrumbs = (pageName) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      [pageName]: null,
    })
  })
}

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

const assertAddItemButton = (buttonText, link) => {
  cy.get('[data-test="add-collection-item-button"]')
    .should('exist')
    .should('contain', buttonText)
    .should('have.attr', 'href', link)
}

const assertAddItemButtonNotPresent = () => {
  cy.get('[data-test="add-collection-item-button"]').should('not.exist')
}

const assertBadge = (item, badgeText) => {
  cy.get(item).find('[data-test="badge"]').should('contain', badgeText)
}

const assertTag = (item, badgeText) => {
  cy.get(item)
    .find('[data-test="collection-item-tag"]')
    .should('contain', badgeText)
}

const assertBadgeNotPresent = (item) => {
  cy.get(item).find('[data-test="badge"]').should('not.exist')
}

const assertTagNotPresent = (item, badgeText) => {
  cy.get(item)
    .find('[data-test="collection-item-tag"]')
    .should('not.contain', badgeText)
}

const assertBadgeShouldNotExist = (item) => {
  cy.get(item).find('[data-test="badge"]').should('not.exist')
}
const assertTagShouldNotExist = (item) => {
  cy.get(item).find('[data-test="collection-item-tag"]').should('not.exist')
}

const assertMetaList = (items) => {
  items.forEach((itm) => {
    cy.get('[data-test="meta-list"]')
      .find(`[text="${itm[0]}"]`)
      .should('contain', itm[1])
  })
}

const assertMetadataItem = (item, metadataText) => {
  cy.get(item).find('[data-test="metadata"]').should('contain', metadataText)
}

const assertMetadataItemNotPresent = (item, metadataText) => {
  cy.get(item)
    .find('[data-test="metadata"]')
    .should('not.contain', metadataText)
}

const assertRemoveAllFiltersNotPresent = () => {
  it('should not render a "Remove all filters" button', () => {
    cy.get('[data-test="clear-filters"]').should('not.exist')
  })
}

const assertListLength = (fakeList) => {
  cy.get('[data-test="collection-list"]').should('have.length', 1)
  cy.get('[data-test="collection-item"]').should('have.length', fakeList.length)
}

const assertItemLink = (item, linkText, link) => {
  cy.get(item)
    .find('h3')
    .children()
    .should('have.text', linkText)
    .should('have.attr', 'href', link)
}

const assertArchiveSummary = (type) => {
  const message =
    type === 'contact'
      ? 'Why can I not add a ' + type + '?'
      : 'Why can I not add an ' + type + '?'
  it('should render the archived summary', () => {
    cy.get('[data-test="archived-details"]').should('contain', message)
  })
}

const assertArchiveMessage = (type) => {
  const message = type + ' cannot be added to an archived company.'
  it('should render an archived explanation', () => {
    cy.get('[data-test="archived-details"]').should('contain', message)
  })
}

const assertUnarchiveLink = (url) => {
  it('should render "Click here to unarchive"', () => {
    cy.get('[data-test="archived-details"]')
      .find('a')
      .should('have.text', 'Click here to unarchive')
      .should('have.attr', 'href', url)
  })
}

const assertUpdatedOn = (item, text) => {
  cy.get(item).find('h4').should('have.text', text)
}

const assertRole = (roleType) => {
  it('should contain a status role', () => {
    cy.get(`[role="${roleType}"]`).should('exist')
  })
}

const assertTitle = (headingText) => {
  it('should render a title', () => {
    cy.get('h2').should('contain', headingText)
  })
}

const assertPaginationSummary = (pageText) => {
  cy.get('[data-test=pagination-summary]').contains(pageText)
}

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
  assertMetaList,
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
