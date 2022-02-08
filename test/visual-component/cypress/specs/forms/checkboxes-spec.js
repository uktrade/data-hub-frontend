describe('Forms', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  describe('Default', () => {
    it('should render the default checkbox component correctly', () => {
      cy.visit('/iframe.html?id=form-form-elements-checkboxes--default')
      cy.get('#root').should('be.visible').compareSnapshot('default')
    })
  })

  describe('Hint', () => {
    it('should render the checkbox with hint component correctly', () => {
      cy.visit('/iframe.html?id=form-form-elements-checkboxes--checkboxes-hint')
      cy.get('#root').should('be.visible').compareSnapshot('hint')
    })
  })

  describe('Legend', () => {
    it('should render the checkbox with legend component correctly', () => {
      cy.visit(
        '/iframe.html?id=form-form-elements-checkboxes--checkboxes-legend'
      )
      cy.get('#root').should('be.visible').compareSnapshot('legend')
    })
  })
})
