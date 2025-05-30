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
    .find('h2')
    .children()
    .should('exist')
    .should('have.text', subject)
    .should('have.attr', 'href', link)
}

/**
 * Asserts that a given metadata element in an activity item is correct
 */
export const assertMetadataItems = (expectedMetadata) => {
  cy.get('[data-test="metadata-label"]').as('metadataLabels')
  cy.get('@metadataLabels')
    .should('have.length', expectedMetadata.length)
    .each((x, i) => {
      cy.get('@metadataLabels')
        .eq(i)
        .should('have.text', expectedMetadata[i].label)
    })
  cy.get('[data-test="metadata-value"]').as('metadataValues')
  cy.get('@metadataValues')
    .should('have.length', expectedMetadata.length)
    .each((x, i) => {
      cy.get('@metadataValues')
        .eq(i)
        .should('have.text', expectedMetadata[i].value)
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

export const assertEYBLabel = () => {
  assertText('[data-test="eyb-kind-label"]', 'EYB')
}

export const assertNotEYBLabel = () => {
  cy.get('[data-test="eyb-kind-label"]').should('not.exist')
}
export const assertOrderKindLabel = () => {
  assertText('[data-test="order-kind-label"]', 'New Order')
}

export const assertGreatKindLabel = () => {
  assertText('[data-test="great-kind-label"]', 'great.gov.uk')
}

export const assertInvestmentThemeLabel = () => {
  assertText('[data-test="investment-theme-label"]', 'Investment')
}
