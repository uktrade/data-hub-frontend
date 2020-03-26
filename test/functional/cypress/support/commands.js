Cypress.Commands.add(
  'dh_typeahead_typeAndSelect',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject)
      .find('input')
      .type(text, { force: true })
      .type('{enter}')

    return cy.wrap(subject)
  }
)
