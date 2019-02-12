import selectors from '../selectors'

describe('Data hub homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Contacts Nav', () => {
    cy.get(selectors.homePage.contactNav).should('contain', 'Contacts')
  })
})
