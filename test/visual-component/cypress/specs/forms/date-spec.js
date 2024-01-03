describe('Forms', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  describe('Default', () => {
    it('should render the date component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-date--field-date-default-validation'
      )
      cy.get('#storybook-root').should('be.visible').compareSnapshot('default')
    })
  })

  describe('Custom', () => {
    it('should render the custom date component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-date--field-date-custom-validation'
      )
      cy.get('#storybook-root').should('be.visible').compareSnapshot('custom')
    })
  })

  describe('Short', () => {
    it('should render the short date component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-date--field-date-short-format'
      )
      cy.get('#storybook-root').should('be.visible').compareSnapshot('short')
    })
  })

  describe('Reduced', () => {
    it('should render the reduced date component correctly', () => {
      cy.visit('/iframe.html?id=form-form-elements-date--field-date-reduced')
      cy.get('#storybook-root').should('be.visible').compareSnapshot('reduced')
    })
  })
})
