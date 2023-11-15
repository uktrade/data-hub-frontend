import { clickContinueButton, clickSubmitButton } from '../../support/actions'
import { assertUrl, assertLocalHeader } from '../../support/assertions'
import { companyFaker } from '../../fakers/companies'
import urls from '../../../../../src/lib/urls'

const clickContinueAndAssertUrl = (url) => {
  clickContinueButton()
  assertUrl(url)
}

const clickSubmitAndAssertUrl = (url) => {
  clickSubmitButton()
  assertUrl(url)
}

describe('Adding an export win', () => {
  const company = companyFaker()

  // Form steps and query params
  const officerDetails = `?step=officer_details&company=${company.id}`
  const creditForThisWin = `?step=credit_for_this_win&company=${company.id}`
  const customerDetails = `?step=customer_details&company=${company.id}`
  const winDetails = `?step=win_details&company=${company.id}`
  const supportProvided = `?step=support_provided&company=${company.id}`
  const checkBeforeSending = `?step=check_before_sending&company=${company.id}`

  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company)
  })

  it('should render the header', () => {
    cy.visit(`${urls.companies.exportWins.create()}${officerDetails}`)
    assertLocalHeader('Add export win')
    cy.get('[data-test="subheading"]').should('have.text', company.name)
  })

  context('Officer details', () => {
    it('should complete this step and continue to "Credit for this win"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${officerDetails}`)
      clickContinueAndAssertUrl(creditForThisWin)
    })
  })

  context('Credit for this win', () => {
    it('should complete this step and continue to "Customer details"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${creditForThisWin}`)
      clickContinueAndAssertUrl(customerDetails)
    })
  })

  context('Customer details', () => {
    it('should complete this step and continue to "Win details"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${customerDetails}`)
      clickContinueAndAssertUrl(winDetails)
    })
  })

  context('Win details', () => {
    it('should complete this step and continue to "Support provided"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${winDetails}`)
      clickContinueAndAssertUrl(supportProvided)
    })
  })

  context('Support provided', () => {
    it('should complete this step and continue to "Check before sending"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${supportProvided}`)
      clickContinueAndAssertUrl(checkBeforeSending)
    })
  })

  context('Check before sending', () => {
    it('should complete this step and submit and redirect to "Unconfirmed wins"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${checkBeforeSending}`)
      clickSubmitAndAssertUrl(urls.companies.exportWins.unconfirmed())
    })
  })
})
