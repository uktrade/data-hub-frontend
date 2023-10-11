import React from 'react'

import ActivityCardMetadata from '../../../../../../../src/client/components/ActivityFeed/activities/card/ActivityCardMetadata'
import { GREY_1 } from '../../../../../../../src/client/utils/colours'

describe('ActivityCardMetadata', () => {
  const Component = (props) => <ActivityCardMetadata {...props} />

  const metadata = [
    { label: 'Name', value: 'Chloe Wong' },
    { label: 'Favourite food', value: 'Sunday roast' },
  ]
  context('Displays correct styling of metadata', () => {
    beforeEach(() => {
      cy.mount(<Component metadata={metadata}></Component>)
    })
    it('should show the name label and value', () => {
      cy.get('[data-test="name-label"]')
        .should('have.text', 'Name: Chloe Wong')
        .should('have.colour', GREY_1)
    })

    it('should show the name label in bold', () => {
      cy.get('[data-test="name-label"] > span')
        .should('have.text', 'Name:')
        .should('have.css', 'font-weight', '700')
    })

    it('should show the favourite food label and value', () => {
      cy.get('[data-test="favourite-food-label"]')
        .should('have.text', 'Favourite food: Sunday roast')
        .should('have.colour', GREY_1)
    })

    it('should show the favourite food label in bold', () => {
      cy.get('[data-test="favourite-food-label"] > span')
        .should('have.text', 'Favourite food:')
        .should('have.css', 'font-weight', '700')
    })
  })
})
