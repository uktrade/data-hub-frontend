import React from 'react'

import { CompanyDetails } from '../../../../../../src/client/modules/Omis/PaymentReconciliation'
import {
  COMPANY_ADDRESS,
  COMPANY_REGISTERED_ADDRESS,
  COMPANY_BOTH_ADDRESSES,
} from '../constants'

describe('PaymentReconciliation company details', () => {
  context('When viewing a company with a non-registered address', () => {
    beforeEach(() => {
      cy.mount(<CompanyDetails company={COMPANY_ADDRESS} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=company-heading]')
        .should('exist')
        .should('have.text', 'Company details')
    })

    it('should render the company name', () => {
      cy.get('[data-test="company-name"]')
        .should('exist')
        .should('have.text', COMPANY_ADDRESS.name)
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
      cy.mount(<CompanyDetails company={COMPANY_REGISTERED_ADDRESS} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=company-heading]')
        .should('exist')
        .should('have.text', 'Company details')
    })

    it('should render the company name', () => {
      cy.get('[data-test="company-name"]')
        .should('exist')
        .should('have.text', COMPANY_REGISTERED_ADDRESS.name)
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
      cy.mount(<CompanyDetails company={COMPANY_BOTH_ADDRESSES} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=company-heading]')
        .should('exist')
        .should('have.text', 'Company details')
    })

    it('should render the company name', () => {
      cy.get('[data-test="company-name"]')
        .should('exist')
        .should('have.text', COMPANY_BOTH_ADDRESSES.name)
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
