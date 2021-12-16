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

  cy.url().should(
    'eq',
    `${
      Cypress.config().baseUrl
    }/investments/opportunities/new-large-capital-uk-opportunity-id/details`
  )
})
