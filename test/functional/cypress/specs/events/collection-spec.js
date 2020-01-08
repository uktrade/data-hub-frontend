import { assertBreadcrumbs } from '../../support/assertions'

const selectors = require('../../../../selectors')

describe('Event Collections', () => {
  before(() => {
    cy.visit('/events')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Events: null,
    })
  })

  it('should display a list of events', () => {
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 7)
  })

  it('should contain event badge', () => {
    cy.get(selectors.entityCollection.entityBadge(1)).should(
      'contain',
      'Turks and Caicos Islands'
    )
  })

  it('should contain event details', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Exhibition')
      .and('contain', '26 September 2017')
      .and('contain', '3 October 2017')
      .and('contain', 'Event 1')
      .and('contain', 'BG - Executive Support')
  })

  it('should display Add Event button', () => {
    cy.get(selectors.entityCollection.addEvent)
      .should('be.visible')
      .and('contain', 'Add event')
  })
})
