describe('Header', () => {
  it('should render the header component correctly', () => {
    cy.visit('/iframe.html?id=collection-collectionheader--collection-header')
    cy.get('#storybook-root').should('be.visible').compareSnapshot('header')
  })
})

describe('Profile item', () => {
  it('should render the profile item component correctly', () => {
    cy.visit('/iframe.html?id=collection--capital-profile-item')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('profile-item')
  })
})

describe('Interaction item', () => {
  it('should render the interaction item component correctly', () => {
    cy.visit('/iframe.html?id=collection--interaction-item')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('interaction-item')
  })
})

describe('Item without link', () => {
  it('should render the item without link component correctly', () => {
    cy.visit('/iframe.html?id=collection--item-without-link')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('item-without-link')
  })
})

describe('Collection list', () => {
  it('should render the collection list component correctly', () => {
    cy.visit('/iframe.html?id=collection-collectionlist--collection-list')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('collection-list')
  })
})

describe('Collection list with 0 items', () => {
  it('should render the collection list with 0 items component correctly', () => {
    cy.visit(
      '/iframe.html?id=collection-collectionlist--collection-list-with-0-items'
    )
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('collection-list-with-0-items')
  })
})
