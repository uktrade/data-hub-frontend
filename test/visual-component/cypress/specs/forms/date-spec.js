describe('Forms', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  describe('Default', () => {
    it('should render the date component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-date--fielddate-default-validation'
      )
      cy.get('#root').should('be.visible').compareSnapshot('default')
    })
  })

  describe('Custom', () => {
    it('should render the custom date component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-date--fielddate-custom-validation'
      )
      cy.get('#root').should('be.visible').compareSnapshot('custom')
    })
  })

  describe('Short', () => {
    it('should render the short date component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-date--fielddate-short-format'
      )
      cy.get('#root').should('be.visible').compareSnapshot('short')
    })
  })

  describe('Reduced', () => {
    it('should render the reduced date component correctly', () => {
      cy.visit('/iframe.html?id=form-form-elements-date--fielddate-reduced')
      cy.get('#root').should('be.visible').compareSnapshot('reduced')
    })
  })
})
