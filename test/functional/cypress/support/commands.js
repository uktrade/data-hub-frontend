Cypress.Commands.add(
  'selectTypeaheadOption',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject)
      .find('input')
      .type(text, { force: true })
      .type('{enter}')

    return cy.wrap(subject)
  }
)
