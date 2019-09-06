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

    it('should display "Companies" subheader', () => {
      cy.get(selectors.companyAdd.subheader).should('have.text', 'Companies')
    })

    it('should display "Next" button', () => {
      cy.get(selectors.companyAdd.nextButton).should('be.visible')
    })

    context('when I click the "Next" button', () => {
      before(() => {
        cy.get(selectors.companyAdd.nextButton).click()
      })

      it('should display the "Find the company" heading', () => {
        cy.get(selectors.companyAdd.h3).should('have.text', 'Find the company')
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

          it('should display "Add this company to Data Hub" subheader', () => {
            cy.get(selectors.companyAdd.companyDetails.subheader).should('have.text', 'Add this company to Data Hub')
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
