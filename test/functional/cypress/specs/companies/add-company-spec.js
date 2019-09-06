const selectors = require('../../selectors')

describe('Add company form', () => {
  context('when viewing "Add a company form"', () => {
    before(() => {
      cy.visit('/companies/create')
    })

    beforeEach(function () {
      Cypress.Cookies.preserveOnce('datahub.sid')
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add company')
    })

    it('should display "Where is this company based?" heading', () => {
      cy.get(selectors.companyAdd.stepHeader).should('have.text', 'Where is this company based?')
    })

    it('should display "Next" button', () => {
      cy.get(selectors.companyAdd.nextButton).should('be.visible')
    })

    context('when I click the "Next" button without specifying company location', () => {
      before(() => {
        cy.get(selectors.companyAdd.nextButton).click()
      })

      it('should display error message', () => {
        cy.get(selectors.companyAdd.form).contains('Specify location of the company')
      })
    })

    context('when I select "Overseas" on the company location radio button', () => {
      before(() => {
        cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
      })

      it('should display "Country" selection', () => {
        cy.get(selectors.companyAdd.form).contains('Country')
        cy.get(selectors.companyAdd.form).find('select').should('be.visible')
      })
    })

    context('when I click the "Next" button without specifying company country', () => {
      before(() => {
        cy.get(selectors.companyAdd.nextButton).click()
      })

      it('should display error message', () => {
        cy.get(selectors.companyAdd.form).contains('Select in which country the company is based')
      })
    })

    context('when I click the "Next" button after filling the required fields', () => {
      before(() => {
        cy.get(selectors.companyAdd.form).find('select').select('Poland')
        cy.get(selectors.companyAdd.nextButton).click()
      })

      it('should display the "Find the company" heading', () => {
        cy.get(selectors.companyAdd.stepHeader).should('have.text', 'Find the company')
      })

      it('should display the "Based in the Poland" text', () => {
        cy.get(selectors.companyAdd.form).find('p').contains('Based in the Poland')
      })

      it('should display "Back" button', () => {
        cy.get(selectors.companyAdd.backButton).should('be.visible')
      })

      it('should not display the "Next" button', () => {
        cy.get(selectors.companyAdd.nextButton).should('not.be.visible')
      })

      context('when I click the "Search" button', () => {
        before(() => {
          cy.get(selectors.companyAdd.entitySearch.searchButton).click()
        })

        it('should display the entity search results', () => {
          cy.get(selectors.companyAdd.entitySearch.results.someCompanyName).should('be.visible')
          cy.get(selectors.companyAdd.entitySearch.results.someOtherCompany).should('be.visible')
        })

        context('when I click the first company that does not exist on Data Hub', () => {
          before(() => {
            cy.get(selectors.companyAdd.entitySearch.results.someOtherCompany).click()
          })

          it('should display "Confirm you want to add this company to Data Hub" subheader', () => {
            cy.get(selectors.companyAdd.stepHeader).should('have.text', 'Confirm you want to add this company to Data Hub')
          })

          it('should display "Back" button', () => {
            cy.get(selectors.companyAdd.backButton).should('be.visible')
          })

          it('should display "Add company" button', () => {
            cy.get(selectors.companyAdd.submitButton).should('be.visible')
          })
        })
      })
    })
  })
})
