import React from 'react'

import { CompanyDetails } from '../../../../../../src/client/modules/Omis/CreateOrder/CreateOrder'
import { COMPANY_ADDRESS, COMPANY_REGISTERED_ADDRESS } from '../constants'
import urls from '../../../../../../src/lib/urls'

describe('CompanyDetails', () => {
  context('when the company does not have a registered address', () => {
    beforeEach(() => {
      cy.mount(<CompanyDetails company={COMPANY_ADDRESS} />)
    })

    it('should render the company label', () => {
      cy.get('[data-test="company-label"]')
        .should('exist')
        .should('have.text', 'Company')
    })
    it('should display the correct company name', () => {
      cy.get('[data-test="company-details"]')
        .should('exist')
        .should('contain', COMPANY_ADDRESS.name)
    })
    it('should display the correct company address', () => {
      cy.get('[data-test="company-details"]').should(
        'contain',
        'Address line 1, Address line 2, town, Test County, postcode, Test Country'
      )
    })
    it('should display the company change link', () => {
      cy.get('[data-test="company-change-link"]')
        .should('exist')
        .should('have.text', 'Change company')
        .should('have.attr', 'href', urls.omis.create.companySelect())
    })
  })
  context('when the company does have a registered address', () => {
    beforeEach(() => {
      cy.mount(<CompanyDetails company={COMPANY_REGISTERED_ADDRESS} />)
    })

    it('should render the company label', () => {
      cy.get('[data-test="company-label"]')
        .should('exist')
        .should('have.text', 'Company')
    })
    it('should display the correct company name', () => {
      cy.get('[data-test="company-details"]')
        .should('exist')
        .should('contain', COMPANY_REGISTERED_ADDRESS.name)
    })
    it('should display the correct company address', () => {
      cy.get('[data-test="company-details"]').should(
        'contain',
        'Registered Address line 1, Registered Address line 2, Registered town, Test Registered County, Registered postcode, Test Registered Country'
      )
    })
    it('should display the company change link', () => {
      cy.get('[data-test="company-change-link"]')
        .should('exist')
        .should('have.text', 'Change company')
        .should('have.attr', 'href', urls.omis.create.companySelect())
    })
  })
})
