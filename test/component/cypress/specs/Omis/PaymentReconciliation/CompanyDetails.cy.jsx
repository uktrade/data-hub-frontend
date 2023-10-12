import React from 'react'

import { CompanyDetails } from '../../../../../../src/client/modules/Omis/PaymentReconciliation'

const address = {
  country: {
    name: 'Test Country',
  },
  county: 'Test County',
  line1: 'Address line 1',
  line2: 'Address line 2',
  postcode: 'postcode',
  town: 'town',
}

const registeredAddress = {
  country: {
    name: 'Test Registered Country',
  },
  county: 'Test Registered County',
  line1: 'Registered Address line 1',
  line2: 'Registered Address line 2',
  postcode: 'Registered postcode',
  town: 'Registered town',
}

const addressCompany = {
  name: 'Company with address',
  address: address,
}

const regAddressCompany = {
  name: 'Company with reg address',
  registeredAddress: registeredAddress,
}

const bothAddressCompany = {
  name: 'Company with both addresses',
  address: address,
  registeredAddress: registeredAddress,
}

describe('PaymentReconciliation company details', () => {
  context('When viewing a company with a non-registered address', () => {
    beforeEach(() => {
      cy.mount(<CompanyDetails company={addressCompany} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=company-heading]')
        .should('exist')
        .should('have.text', 'Company details')
    })

    it('should render the company name', () => {
      cy.get('[data-test="company-name"]')
        .should('exist')
        .should('have.text', addressCompany.name)
    })

    it('should render the company address', () => {
      cy.get('[data-test="company-address"]')
        .should('exist')
        .should(
          'have.text',
          'Address line 1, Address line 2, town, Test County, postcode, Test Country'
        )
    })
  })

  context('When viewing a company with a registered address', () => {
    beforeEach(() => {
      cy.mount(<CompanyDetails company={regAddressCompany} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=company-heading]')
        .should('exist')
        .should('have.text', 'Company details')
    })

    it('should render the company name', () => {
      cy.get('[data-test="company-name"]')
        .should('exist')
        .should('have.text', regAddressCompany.name)
    })

    it('should render the company address', () => {
      cy.get('[data-test="company-address"]')
        .should('exist')
        .should(
          'have.text',
          'Registered Address line 1, Registered Address line 2, Registered town, Test Registered County, Registered postcode, Test Registered Country'
        )
    })
  })

  context('When viewing a company with both address types', () => {
    beforeEach(() => {
      cy.mount(<CompanyDetails company={bothAddressCompany} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=company-heading]')
        .should('exist')
        .should('have.text', 'Company details')
    })

    it('should render the company name', () => {
      cy.get('[data-test="company-name"]')
        .should('exist')
        .should('have.text', bothAddressCompany.name)
    })

    it('should render the registered address', () => {
      cy.get('[data-test="company-address"]')
        .should('exist')
        .should(
          'have.text',
          'Registered Address line 1, Registered Address line 2, Registered town, Test Registered County, Registered postcode, Test Registered Country'
        )
    })
  })
})
