const fixtures = require('../../fixtures/index')

const urls = require('../../../../../src/lib/urls')

const { draftOrder } = fixtures.omis

describe('View edit quote information', () => {
  beforeEach(() => {
    cy.visit(urls.omis.edit.quote(draftOrder.id))
  })

  it('Should render edit form', () => {
    cy.contains('Edit quote information').should('exist')
  })

  it('Should submit form successfully', () => {
    const year = new Date().getFullYear() + 1
    cy.get('#field-delivery_date').type(`04/02/${year}`)
    cy.contains('Save and return').click()
    cy.location('pathname').should(
      'eq',
      urls.omis.order(draftOrder.id) + '/work-order'
    )
    cy.contains('Changes saved').should('exist')
  })
})
