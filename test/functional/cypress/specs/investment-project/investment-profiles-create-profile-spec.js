describe('Investment / Invenstor profiles / Create an investor profile', () => {
  before(() => {
    cy.visit('/investments/profiles/create-investor-profile')
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

  it('should display a typehead for country of origin', () => {
    cy.get('[data-typeahead-type=country_investment_originates_from]')
  })

  it('should display a typehead for investor company', () => {
    cy.get('[data-typeahead-type=investor_company]')
  })

  it('should display a submit button', () => {
    cy.get('[data-auto-id=investorProfileSave]')
      .should('have.text', 'Save')
  })

  it('should display a cancel button', () => {
    cy.get('.c-form-actions').find('a')
      .should('have.text', 'Cancel')
      .should('have.attr', 'href', '/investments/profiles')
  })

  context('When no company is selected', () => {
    it('should display error message', () => {
      cy.get('[data-auto-id=investorProfileSave]').click()
        .get('.c-error-summary')
    })
  })

  context('When country is selected', () => {
    it('should filter companies using selected country', () => {
      cy.get('.multiselect__input').first().focus().type('Greece')
        .get('.multiselect__element').click()

      cy.get('#group-field-investor_company')
        .find('.multiselect__tags').click()
        .find('input').type('One')
        .get('.multiselect__element').should('not.exist')
    })

    it('should filter companies using selected country and display filtered options', () => {
      cy.get('.multiselect__input').first().focus().type('France')
        .get('.multiselect__element').click()

      cy.get('#group-field-investor_company')
        .find('.multiselect__tags').click()
        .find('input').type('One')
        .get('.multiselect__element').should('exist')
    })

    context('When company is selected', () => {
      context('When submiting the form and company profile exists', () => {
        it('should display a proper error message', () => {
          cy.get('.multiselect__element').eq(1).click()
            .get('[data-auto-id=investorProfileSave]').click()
            .get('.c-error-summary__summary')
            .should('have.text', 'Investor company already has large capital investor profile')
        })
      })

      context('When submiting the form and company profile does exists', () => {
        it('should redirect to the created profile page', () => {
          cy.get('#group-field-investor_company')
            .find('.multiselect__tags').click()
            .find('input').clear().type('One Team')
            .get('.multiselect__element').should('exist')
            .get('.multiselect__element').contains('One Team')
            .get('.multiselect__element').eq(0).click()
            .get('[data-auto-id=investorProfileSave]').click()
            .url().should('include', 'companies/0f5216e0-849f-11e6-ae22-56b6b6499611/investments/large-capital-profile')
        })
      })
    })
  })
})
