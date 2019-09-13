const selectors = require('../../selectors')
const fixtures = require('../../fixtures')

describe('Add company form', () => {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

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

  context('when the user clicks "I still cannot find the company"', () => {
    before(() => {
      cy.visit('/companies/create')

      cy.get(selectors.companyAdd.form).find('[type="radio"]').check('uk')
      cy.get(selectors.companyAdd.nextButton).click()

      cy.get(selectors.companyAdd.entitySearch.searchButton).click()

      cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
      cy.get(selectors.companyAdd.entitySearch.cannotFind.stillCannotFind).click()
    })

    it('should display the form', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.governmentDepartmentOrOtherPublicBody).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.limitedCompany).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.limitedPartnership).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.partnership).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.name).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.website).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.region).should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.sector).should('be.visible')
    })

    context('when I complete the form', () => {
      before(() => {
        cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity).click()
        cy.get(selectors.companyAdd.newCompanyRecordForm.name).type('INVESTIGATION LIMITED')
        cy.get(selectors.companyAdd.newCompanyRecordForm.website).type('www.investigationlimited.com')
        cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type('0123456789')
        cy.get(selectors.companyAdd.newCompanyRecordForm.region).select('London')
        cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select('Advanced Engineering')

        cy.get(selectors.companyAdd.submitButton).click()
      })

      it('should redirect to the new company activity', () => {
        cy.location('pathname').should('eq', `/companies/${fixtures.dnb.investigationLimited.id}/activity`)
      })

      it('should display the flash message', () => {
        cy.get(selectors.localHeader().flash).should('contain', 'Company added to Data Hub')
      })
    })
  })
})
