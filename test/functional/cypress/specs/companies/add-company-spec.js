const selectors = require('../../selectors')

describe('Add company form', () => {
  context('when viewing "Add a company form"', () => {
    before(() => {
      cy.visit('/companies/create')
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

      it('should display "Add a Company" subheader', () => {
        cy.get(selectors.companyAdd.subheader).should('have.text', 'Add a Company')
      })

      it('should display "Back" button', () => {
        cy.get(selectors.companyAdd.backButton).should('be.visible')
      })

      it('should display "Next" button', () => {
        cy.get(selectors.companyAdd.nextButton).should('be.visible')
      })

      context('when I click the "Next" button', () => {
        before(() => {
          cy.get(selectors.companyAdd.nextButton).click()
        })

        it('should display "Add company details" subheader', () => {
          cy.get(selectors.companyAdd.subheader).should('have.text', 'Add company details')
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
