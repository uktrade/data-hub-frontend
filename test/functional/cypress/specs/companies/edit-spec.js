import { assertBreadcrumbs, assertFieldUneditable } from '../../support/assertions'

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Company edit', () => {
  const commonTests = (expected) => {
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [expected.company.name]: `/companies/${expected.company.id}`,
        'Business details': `/companies/${expected.company.id}/business-details`,
        'Edit business details': null,
      })
    })

    it('should render the trading name text field', () => {
      cy.get(selectors.companyEdit.tradingName).should('be.visible')
    })

    it('should render the annual turnover radio buttons', () => {
      cy.get(selectors.companyEdit.annualTurnover.length).should('be', 4)
    })

    it('should render the number of employees radio buttons', () => {
      cy.get(selectors.companyEdit.numberOfEmployees).should('be', 4)
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
      cy.get(selectors.companyEdit.saveButton).should('be.visible')
    })

    it('should render a back link', () => {
      cy.get(selectors.companyEdit.backLink).should('be.visible')
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
      assertFieldUneditable({ name: 'business_type', value: 'Company' })
    })

    it('should render the VAT number text field', () => {
      cy.get(selectors.companyEdit.vatNumber).should('be.visible')
    })

    it('should render the address fields', () => {
      cy.get(selectors.companyEdit.address.postcodeLookupButton)
        .should('be.visible')

      cy.get(selectors.companyEdit.address.postcode)
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

      assertFieldUneditable({ name: 'country', value: 'United Kingdom' })
    })

    it('should render the registered address fields', () => {
      cy.get(selectors.companyEdit.registeredAddressLegend).parent()
        .should('contain', '66 Marcham Road')
        .and('contain', 'Bordley')
        .and('contain', 'BD23 8RZ')
        .and('contain', 'United Kingdom')
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
      assertFieldUneditable({ name: 'sector', value: 'Retail' })
    })

    it('should render the sector details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheSector).should('be.visible')
    })

    it('should not render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy).should('not.exist')
    })

    it('should render the business hierarchy uneditable field', () => {
      assertFieldUneditable({ name: 'headquarter_type', value: 'Not a headquarters' })
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
      cy.get('#field-business_type').should('not.exist')
    })

    it('should render the VAT number text field', () => {
      cy.get(selectors.companyEdit.vatNumber).should('be.visible')
    })

    it('should render the address fields', () => {
      cy.get(selectors.companyEdit.address.postcodeLookupButton)
        .should('be.visible')

      cy.get(selectors.companyEdit.address.postcode)
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

      assertFieldUneditable({ name: 'country', value: 'United Kingdom' })
    })

    it('should not render the registered address fieldset', () => {
      cy.get(selectors.companyEdit.registeredAddressLegend).should('not.exist')
    })

    it('should render the region list', () => {
      cy.get(selectors.companyEdit.region).should('be.visible')
    })

    it('should render the sector list', () => {
      cy.get(selectors.companyEdit.sector).should('be.visible')
    })

    it('should not render the sector details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheSector).should('not.exist')
    })

    it('should render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy.length).should('be', 4)
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
      assertFieldUneditable({ name: 'business_type', value: 'Company' })
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

      assertFieldUneditable({ name: 'country', value: 'United States' })
    })

    it('should render the registered address fieldset', () => {
      cy.get(selectors.companyEdit.registeredAddressLegend).parent()
        .should('contain', '12 First Street')
        .and('contain', 'New York')
        .and('contain', '765413')
        .and('contain', 'United States')
    })

    it('should not render the region list', () => {
      cy.get(selectors.companyEdit.region).should('not.exist')
    })

    it('should render the sector list', () => {
      cy.get(selectors.companyEdit.sector).should('be.visible')
    })

    it('should not render the sector details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheSector).should('not.exist')
    })

    it('should render the business hierarchy radio buttons', () => {
      cy.get(selectors.companyEdit.businessHierarchy.length).should('be', 4)
    })

    it('should not render the business hierarchy details summary', () => {
      cy.get(selectors.companyEdit.needToEditTheHeadquarterType).should('not.exist')
    })
  })
})
