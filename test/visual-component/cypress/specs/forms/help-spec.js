describe('Footer', () => {
  it('should render the help component with footer correctly', () => {
    cy.visit('/iframe.html?id=forms-help--fieldhelp-with-footer-url')
    cy.compareSnapshot('footer')
  })
})

describe('Without footer', () => {
  it('should render the help component without footer correctly', () => {
    cy.visit('/iframe.html?id=forms-help--fieldhelp-without-footer-url')
    cy.compareSnapshot('without-footer')
  })
})

describe('Open', () => {
  it('should render the opened help component correctly', () => {
    cy.visit('/iframe.html?id=forms-help--fieldhelp-set-as-open')
    cy.compareSnapshot('open')
  })
})
