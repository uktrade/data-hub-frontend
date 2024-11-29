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
 * @param {*} index The row number of the item in the activity
 * @param {*} expectedText The expected text
 */
export const assertMetadataItem = (index, expectedText) => {
  cy.get('[data-test="collection-item"]')
    .find('[data-test="metadata-item"]')
    .eq(index)
    .should('have.text', expectedText)
}

export const assertKindLabel = (expectedText = 'Interaction') => {
  assertText('[data-test="activity-kind-label"]', expectedText)
}

export const assertReferralLabel = (expectedText = 'Completed referral') => {
  assertText('[data-test="referral-label"]', expectedText)
}
