const selectors = require('../../../../selectors')

describe('Contact Create Form Validation', () => {
  before(() => {
    cy.visit('/contacts/create?company=validationCompany')
    cy.get(selectors.contactCreate.addContact).click()
  })

  it('should include validation summary message header', () => {
    cy.get(selectors.contactCreate.validationHeader).should('contain', 'There was a problem submitting this form')
  })

  it('should include href in form validation summary', () => {
    const fields = ['#group-field-first_name',
      '#group-field-last_name',
      '#group-field-primary',
      '#group-field-telephone_countrycode',
      '#group-field-telephone_number',
      '#group-field-email']

    fields.forEach((field, i) => {
      cy.get(selectors.contactCreate.validationSummary(i)).find('a').should('have.attr', 'href', field)
    })
  })

  it('should include validation message near the field', () => {
    cy.get(selectors.contactCreate.validationFieldMsg.name).should('contain', 'This field may not be null.')
    cy.get(selectors.contactCreate.validationFieldMsg.surname).should('contain', 'This field may not be null.')
    cy.get(selectors.contactCreate.validationFieldMsg.primaryContact).should('contain', 'This field is required.')
    cy.get(selectors.contactCreate.validationFieldMsg.phone).should('contain', 'This field may not be null.')
    cy.get(selectors.contactCreate.validationFieldMsg.countryCode).should('contain', 'This field may not be null.')
    cy.get(selectors.contactCreate.validationFieldMsg.email).should('contain', 'This field may not be null.')
  })
})
