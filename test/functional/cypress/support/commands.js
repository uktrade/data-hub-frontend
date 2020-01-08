Cypress.Commands.add('selectFirstOption', (selector) => {
  cy.get(selector)
    .find('option')
    .then(($els) => $els.get(1).setAttribute('selected', 'selected'))
    .parent()
    .trigger('change')
})
