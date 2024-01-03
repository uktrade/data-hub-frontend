describe('Dashboard - Flash Messages', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('When there are no flash messages to show', () => {
    it('should hide the flash messages component', () => {
      cy.get('[data-test=flash]').should('not.exist')
    })
  })

  context('When there are flash messages to show', () => {
    before(() => {
      cy.window().then(() => {
        sessionStorage.setItem(
          'flash-messages',
          JSON.stringify({ success: ['Success flash message'] })
        )
      })
    })
    it('should show the flash messages component', () => {
      cy.get('[data-test=flash]').should('exist')
    })
  })

  after(() => {
    cy.resetUser()
  })
})
