export const assertText = (label, expectedText) => {
  cy.get(label).should('exist').should('have.text', expectedText)
}

/**
 * Asserts that an activity header has the expected text and link
 * @param {*} subject The subject of the interaction
 * @param {*} link The link in the interaction header
 */
export const assertActivitySubject = (
  subject,
  link,
  dataTest = 'collection-item'
) => {
  cy.get(`[data-test="${dataTest}"]`)
    .find('h3')
    .children()
    .should('exist')
    .should('have.text', subject)
    .should('have.attr', 'href', link)
}

/**
 * Asserts that a given metadata element in an activity item is correct
 */
export const assertMetadataItems = (expectedMetadata) => {
  cy.get('[data-test="metadata-item"]').as('metadataItems')
  cy.get('@metadataItems')
    .should('have.length', expectedMetadata.length)
    .each((x, i) => {
      cy.get('@metadataItems').eq(i).should('have.text', expectedMetadata[i])
    })
}

export const assertKindLabel = (expectedText = 'Interaction') => {
  assertText('[data-test="activity-kind-label"]', expectedText)
}

export const assertReferralLabel = (expectedText = 'Completed referral') => {
  assertText('[data-test="referral-label"]', expectedText)
}

export const assertProjectKindLabel = () => {
  assertText('[data-test="investment-kind-label"]', 'New Investment Project')
}

export const assertOrderKindLabel = () => {
  assertText('[data-test="order-kind-label"]', 'New Order')
}
