describe('No items', () => {
  it('should render the no items component correctly', () => {
    cy.visit('/iframe.html?id=collection--collection-download-no-items')
    cy.get('#root').should('be.visible').compareSnapshot('no-items')
  })
})

describe('1 item', () => {
  it('should render the 1 item component correctly', () => {
    cy.visit('/iframe.html?id=collection--collection-download-1-item')
    cy.get('#root').should('be.visible').compareSnapshot('1-item')
  })
})

describe('101 items', () => {
  it('should render the 101 items component correctly', () => {
    cy.visit('/iframe.html?id=collection--collection-download-101-items')
    cy.get('#root').should('be.visible').compareSnapshot('101-items')
  })
})

describe('Need to filter', () => {
  it('should render the need to filter component correctly', () => {
    cy.visit('/iframe.html?id=collection--collection-download-need-to-filter')
    cy.get('#root').should('be.visible').compareSnapshot('need-to-filter')
  })
})
