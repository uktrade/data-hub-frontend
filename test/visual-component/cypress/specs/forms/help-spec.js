describe('Forms', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  describe('Footer', () => {
    it('should render the help component with footer correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-help--fieldhelp-with-footer-url'
      )
      cy.compareSnapshot('footer')
    })
  })

  describe('Without footer', () => {
    it('should render the help component without footer correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-help--fieldhelp-without-footer-url'
      )
      cy.compareSnapshot('without-footer')
    })
  })

  describe('Open', () => {
    it('should render the opened help component correctly', () => {
      cy.visit('/iframe.html?id=form-form-elements-help--fieldhelp-set-as-open')
      cy.compareSnapshot('open')
    })
  })
})
