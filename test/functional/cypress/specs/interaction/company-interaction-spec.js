import selectors from '../../selectors'

describe('Company interaction', () => {
  beforeEach(() => {
    cy.visit('/companies/4cd4128b-1bad-4f1e-9146-5d4678c6a018/interactions')
  })

  it('Hide add interaction for archived companies', () => {
    cy.get(selectors.company.addInteraction).should('not.be.visible')
    cy.get(selectors.company.companyInteractionHeader).should('be.visible')

    cy.get(selectors.company.companyInteractionHeader).should('contain', 'Company interactions')
    cy.get(selectors.company.archivedCompanyInteractionMsg).should(
      'contain', 'Why can I not add an interaction?')
  })
})
