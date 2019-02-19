import selectors from '../selectors'

describe('Data hub homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Contacts Nav', () => {
    cy.get(selectors.home.contactNav).should('contain', 'Contacts')
  })
})
