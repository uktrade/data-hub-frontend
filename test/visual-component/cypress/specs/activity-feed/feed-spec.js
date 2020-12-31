describe('Entire feed', () => {
  it('should render the entire feed component correctly', () => {
    cy.visit('/iframe.html?id=activityfeed--entire-feed')
    cy.get('#root').should('be.visible').compareSnapshot('entire-feed')
  })
})

describe('Empty feed', () => {
  it('should render the entire feed component correctly', () => {
    cy.visit('/iframe.html?id=activityfeed--empty-feed')
    cy.get('#root').should('be.visible').compareSnapshot('empty-feed')
  })
})

describe('Company feed', () => {
  it('should render the company feed component correctly', () => {
    cy.visit('/iframe.html?id=activityfeed--data-hub-company-page')
    cy.get('[data-cy="activity-feed"]').should('be.visible')
    cy.get('#root').should('be.visible').compareSnapshot('company-feed')
  })
})

describe('With error', () => {
  it('should render the with error component correctly', () => {
    cy.visit('/iframe.html?id=activityfeed--with-error')
    cy.get('#root').should('be.visible').compareSnapshot('with-error')
  })
})
