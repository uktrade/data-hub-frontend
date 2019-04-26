const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Company edit', () => {
  const commonTests = () => {
    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add business details')
    })

    it('should render the trading name text field', () => {
      cy.get(selectors.companyEdit.tradingName).should('be.visible')
    })

    it('should render the annual turnover radio buttons', () => {
      cy.get(selectors.companyEdit.annualTurnover[0]).should('be.visible')
      cy.get(selectors.companyEdit.annualTurnover[1]).should('be.visible')
      cy.get(selectors.companyEdit.annualTurnover[2]).should('be.visible')
      cy.get(selectors.companyEdit.annualTurnover[3]).should('be.visible')
    })

    it('should render the number of employees radio buttons', () => {
      cy.get(selectors.companyEdit.numberOfEmployees[0]).should('be.visible')
      cy.get(selectors.companyEdit.numberOfEmployees[1]).should('be.visible')
      cy.get(selectors.companyEdit.numberOfEmployees[2]).should('be.visible')
      cy.get(selectors.companyEdit.numberOfEmployees[3]).should('be.visible')
      cy.get(selectors.companyEdit.numberOfEmployees[4]).should('be.visible')
    })

    it('should render the website text field', () => {
      cy.get(selectors.companyEdit.website).should('be.visible')
    })

    it('should render the business description text field', () => {
      cy.get(selectors.companyEdit.businessDescription)
        .should('be.visible')
    })

    it('should render a save button', () => {
      cy.get(selectors.companyEdit.saveButton).should('have.text', 'Add company')
    })

    it('should render a back link', () => {
      cy.get(selectors.companyEdit.backLink).should('have.text', 'Back')
      cy.get(selectors.companyEdit.backLink).should('have.attr', 'href', `/companies/add-step-1`)
    })
  }

  context('when editing a legacy UK company on the One List', () => {
    before(() => {
      cy.visit(`/companies/add/${fixtures.chCompany.mercuryTradingLtd.company_number}`)
    })

    commonTests()

    it('should render the Companies House hidden fields', () => {
      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.name)
        .should('exist')
        .and('have.value', 'Mercury Trading Ltd')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.number)
        .should('exist')
        .and('have.value', '99919')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.address1)
        .should('exist')
        .and('have.value', '64 Ermin Street')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.address2)
        .should('exist')
        .and('have.value', '')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.town)
        .should('exist')
        .and('have.value', 'Y Ffor')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.county)
        .should('exist')
        .and('have.value', '')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.postcode)
        .should('exist')
        .and('have.value', 'LL53 5RN')

      cy.get(selectors.companyAddStep2.hiddenFields.companiesHouse.country)
        .should('exist')
        .and('have.value', '80756b9a-5d95-e211-a939-e4115bead28a')
    })

    it('should render the Companies House number uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-selected_company_number')).should('have.text', '99919')
    })

    it('should render the VAT number text field', () => {
      cy.get(selectors.companyEdit.vatNumber).should('be.visible')
    })

    it('should render the address fields', () => {
      cy.get(selectors.companyEdit.address.postcodeLookup)
        .should('be.visible')
        .and('have.value', 'LL53 5RN')

      cy.get(selectors.companyEdit.address.line1)
        .should('be.visible')
        .and('have.value', '64 Ermin Street')

      cy.get(selectors.companyEdit.address.line2)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.town)
        .should('be.visible')
        .and('have.value', 'Y Ffor')

      cy.get(selectors.companyEdit.address.county)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.postcode)
        .should('not.be.visible')

      cy.get(selectors.companyEdit.address.country)
        .should('not.exist')

      cy.get(selectors.uneditableField('group-field-selected_address_country'))
        .should('have.text', 'United Kingdom')
    })

    it('should render the region list', () => {
      cy.get(selectors.companyEdit.region)
        .should('be.visible')
    })

    it('should render the sector list', () => {
      cy.get(selectors.companyEdit.sector).should('be.visible')
    })

    it('should render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy[0]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[1]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[2]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[3]).should('be.visible')
    })
  })
})
