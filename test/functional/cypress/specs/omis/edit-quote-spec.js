import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import { assertErrorSummary, assertLocalHeader } from '../../support/assertions'

const { draftOrder } = fixtures.omis

describe('View edit quote information', () => {
  beforeEach(() => {
    cy.visit(urls.omis.edit.quote(draftOrder.id))
  })

  it('should render edit form', () => {
    assertLocalHeader('Edit quote information')
  })

  it('should submit form successfully', () => {
    const year = new Date().getFullYear() + 1
    cy.get('[data-test="delivery_date-day"]').type('04')
    cy.get('[data-test="delivery_date-month"]').type('02')
    cy.get('[data-test="delivery_date-year"]').type(`${year}`)
    cy.get('[data-test=submit-button]').click()
    cy.location('pathname').should('eq', urls.omis.workOrder(draftOrder.id))
  })

  it('should not allow a past date to be entered', () => {
    cy.get('[data-test="delivery_date-day"]').type('04')
    cy.get('[data-test="delivery_date-month"]').type('02')
    cy.get('[data-test="delivery_date-year"]').type('2000')
    cy.get('[data-test=submit-button]').click()
    assertErrorSummary(['Delivery date of work must be in the future'])
  })
})
