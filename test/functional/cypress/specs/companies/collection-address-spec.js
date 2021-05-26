import { assertBreadcrumbs } from '../../support/assertions'

const selectors = require('../../../../selectors')

describe('Company Collection Address', () => {
  before(() => {
    cy.visit('/companies?sortby=collectionTest')
  })

  it('should render home breadcumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: null,
    })
  })

  it('should contain california displaying area for a us address', () => {
    cy.get(selectors.entityCollection.entity(5))
      .should('contain', 'Social Gaming Network')
      .and(
        'contain',
        ' 3525 Eastham Drive, Culver City, CA, 90232, California, United States'
      )
  })
})
