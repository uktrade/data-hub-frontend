const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Company edit', () => {
  const commonTests = (expected) => {
    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', expected.company.name)
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/companies/${expected.company.id}`)
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.text', 'Business details')
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.attr', 'href', `/companies/${expected.company.id}/business-details`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Edit business details')
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
        .and('have.value', expected.company.description || '')
    })

    it('should render a save button', () => {
      cy.get(selectors.companyEdit.saveButton).should('have.text', 'Save and return')
    })

    it('should render a back link', () => {
      cy.get(selectors.companyEdit.backLink).should('have.text', 'Return without saving')
      cy.get(selectors.companyEdit.backLink).should('have.attr', 'href', `/companies/${expected.company.id}/business-details`)
    })
  }

  context('when editing a legacy UK company on the One List', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.venusLtd.id}/edit`)
    })

    commonTests({
      company: fixtures.company.venusLtd,
    })

    it('should render the business type uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-business_type')).should('have.text', 'Company')
    })

    it('should render the VAT number text field', () => {
      cy.get(selectors.companyEdit.vatNumber).should('be.visible')
    })

    it('should render the address fields', () => {
      cy.get(selectors.companyEdit.address.postcodeLookup)
        .should('be.visible')
        .and('have.value', 'BD23 8RZ')

      cy.get(selectors.companyEdit.address.line1)
        .should('be.visible')
        .and('have.value', '66 Marcham Road')

      cy.get(selectors.companyEdit.address.line2)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.town)
        .should('be.visible')
        .and('have.value', 'Bordley')

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

    it('should render the registered address fields', () => {
      cy.get(selectors.companyEdit.registeredAddress.fieldset.selector).should('be.visible')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(1)).should('have.text', '66 Marcham Road')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(2)).should('have.text', 'Bordley')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(3)).should('have.text', 'BD23 8RZ')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(4)).should('have.text', 'United Kingdom')
    })

    it('should render the region list', () => {
      cy.get(selectors.companyEdit.region)
        .should('be.visible')
        .find(':selected')
        .contains('North West')
    })

    it('should not render the sector list', () => {
      cy.get(selectors.companyEdit.sector).should('not.exist')
    })

    it('should render the sector uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-sector')).should('have.text', 'Retail')
    })

    it('should render the sector details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheSector).should('be.visible')
    })

    it('should not render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy[0]).should('not.exist')
      cy.get(selectors.companyEdit.businessHierarchy[1]).should('not.exist')
      cy.get(selectors.companyEdit.businessHierarchy[2]).should('not.exist')
      cy.get(selectors.companyEdit.businessHierarchy[3]).should('not.exist')
    })

    it('should render the business hierarchy uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-headquarter_type')).should('have.text', 'Not a headquarters')
    })

    it('should render the business hierarchy details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheHeadquarterType).should('be.visible')
    })
  })

  context('when editing a legacy UK company with minimal data and not on the One List', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.minimallyMinimalLtd.id}/edit`)
    })

    commonTests({
      company: fixtures.company.minimallyMinimalLtd,
    })

    it('should not render the business type uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-business_type')).should('not.exist')
    })

    it('should render the VAT number text field', () => {
      cy.get(selectors.companyEdit.vatNumber).should('be.visible')
    })

    it('should render the address fields', () => {
      cy.get(selectors.companyEdit.address.postcodeLookup)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.line1)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.line2)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.town)
        .should('be.visible')
        .and('have.value', '')

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

    it('should not render the registered address fieldset', () => {
      cy.get(selectors.companyEdit.registeredAddress.fieldset.selector).should('not.exist')
    })

    it('should render the region list', () => {
      cy.get(selectors.companyEdit.region).should('be.visible')
    })

    it('should render the sector list', () => {
      cy.get(selectors.companyEdit.sector).should('be.visible')
    })

    it('should not render the sector uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-sector')).should('not.exist')
    })

    it('should not render the sector details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheSector).should('not.exist')
    })

    it('should render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy[0]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[1]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[2]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[3]).should('be.visible')
    })

    it('should not render the business hierarchy uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-headquarter_type')).should('not.exist')
    })

    it('should not render the business hierarchy details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheHeadquarterType).should('not.exist')
    })
  })

  context('when editing a legacy foreign company not on the One List', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}/edit`)
    })

    commonTests({
      company: fixtures.company.marsExportsLtd,
    })

    it('should render the business type uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-business_type')).should('have.text', 'Company')
    })

    it('should not render the VAT number text field', () => {
      cy.get(selectors.companyEdit.vatNumber).should('not.exist')
    })

    it('should render the address fields', () => {
      cy.get(selectors.companyEdit.address.postcodeLookup)
        .should('not.exist')

      cy.get(selectors.companyEdit.address.line1)
        .should('be.visible')
        .and('have.value', '12 First Street')

      cy.get(selectors.companyEdit.address.line2)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.town)
        .should('be.visible')
        .and('have.value', 'New York')

      cy.get(selectors.companyEdit.address.county)
        .should('be.visible')
        .and('have.value', '')

      cy.get(selectors.companyEdit.address.postcode)
        .should('be.visible')
        .and('have.value', '765413')

      cy.get(selectors.companyEdit.address.country)
        .should('be.visible')
        .find(':selected')
        .contains('United States')

      cy.get(selectors.uneditableField('group-field-selected_address_country'))
        .should('not.exist')
    })

    it('should render the registered address fieldset', () => {
      cy.get(selectors.companyEdit.registeredAddress.fieldset.selector).should('be.visible')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(1)).should('have.text', '12 First Street')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(2)).should('have.text', 'New York')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(3)).should('have.text', '765413')
      cy.get(selectors.companyEdit.registeredAddress.fieldset.listItem(4)).should('have.text', 'United States')
    })

    it('should not render the region list', () => {
      cy.get(selectors.companyEdit.region).should('not.exist')
    })

    it('should render the sector list', () => {
      cy.get(selectors.companyEdit.sector).should('be.visible')
    })

    it('should not render the sector uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-sector')).should('not.exist')
    })

    it('should not render the sector details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheSector).should('not.exist')
    })

    it('should render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy[0]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[1]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[2]).should('be.visible')
      cy.get(selectors.companyEdit.businessHierarchy[3]).should('be.visible')
    })

    it('should not render the business hierarchy uneditable field', () => {
      cy.get(selectors.uneditableField('group-field-headquarter_type')).should('not.exist')
    })

    it('should not render the business hierarchy details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheHeadquarterType).should('not.exist')
    })
  })
})
