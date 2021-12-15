it('Create UK Investment Opportunity page', () => {
  cy.visit('/investments/opportunities/create')

  cy.contains('Save').click()
  cy.contains('There is a problem')
  cy.contains('Enter an opportunity name')

  cy.get('input[name="name"]').type(
    'Battersea power station regeneration{enter}'
  )
  cy.contains('There is a problem').should('not.exist')
  cy.contains('Enter an opportunity name').should('not.exist')
  cy.contains('Battersea power station regeneration')
  cy.contains('Seeking investment')
  cy.contains('13 May 2019, 3:01pm')
  cy.contains('7 fields incomplete')
  cy.contains('5 fields incomplete')
  cy.contains('Need to delete this opportunity?')

  cy.url().should(
    'eq',
    `${
      Cypress.config().baseUrl
    }/investments/opportunities/new-large-capital-uk-opportunity-id/details`
  )
})
