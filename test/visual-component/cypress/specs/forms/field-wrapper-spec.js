describe('Label', () => {
  it('should render the input label component correctly', () => {
    cy.visit(
      '/iframe.html?id=form-form-elements-fieldwrapper--fieldwrapper-label'
    )
    cy.get('#field-testField').should('be.visible').compareSnapshot('label')
  })
})

describe('Label', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  it('should render the input legend component correctly', () => {
    cy.visit(
      '/iframe.html?id=form-form-elements-fieldwrapper--fieldwrapper-legend'
    )
    cy.get('#root').should('be.visible').compareSnapshot('legend')
  })
})
