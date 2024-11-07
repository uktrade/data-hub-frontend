import React from 'react'

import ActivityCardLabels from '../../../../../../../src/client/components/ActivityFeed/activities/card/ActivityCardLabels'

import { rgb } from '../../../../../../../src/client/utils/colours'

// Cypress only deals with RGB values
const colours = {
  govBlue: {
    colour: rgb('#ffffff'),
    backgroundColour: rgb('#1d70b8'),
  },
  grey: { colour: rgb('#282d30'), backgroundColour: rgb('#e5e6e7') },
  blue: { colour: rgb('#0c2d4a'), backgroundColour: rgb('#bbd4ea') },
  darkGreen: {
    colour: rgb('#ffffff'),
    backgroundColour: rgb('#10403c'),
  },
  turquoise: {
    colour: rgb('#10403c'),
    backgroundColour: rgb('#d4ecea'),
  },
}

describe('ActivityCardLabels', () => {
  const Component = (props) => <ActivityCardLabels {...props} />

  context('When it is an internal activity', () => {
    context('When there is an activity/kind label', () => {
      beforeEach(() => {
        cy.mount(<Component kind="Activity Type" />)
      })

      it('should render the right text', () => {
        cy.get('[data-test="activity-kind-label"]')
          .should('exist')
          .should('have.text', 'Activity Type')
      })

      it('should have a grey label', () => {
        cy.get('[data-test="activity-kind-label"]')
          .should('have.css', 'color', colours.grey.colour)
          .should('have.css', 'background-color', colours.grey.backgroundColour)
      })
    })

    context('When there is NOT a kind property value', () => {
      beforeEach(() => {
        cy.mount(<Component kind={undefined} />)
      })

      it('should not render the label', () => {
        cy.get('[data-test="activity-kind-label"]').should('not.exist')
      })
    })

    context('When there is an topic/theme label', () => {
      beforeEach(() => {
        cy.mount(<Component theme="Topic Label" />)
      })

      it('should render the right text', () => {
        cy.get('[data-test="activity-theme-label"]')
          .should('exist')
          .should('have.text', 'Topic Label')
      })

      it('should have the gov blue colour label', () => {
        cy.get('[data-test="activity-theme-label"]')
          .should('have.css', 'color', colours.govBlue.colour)
          .should(
            'have.css',
            'background-color',
            colours.govBlue.backgroundColour
          )
      })
    })

    context('When there is a sub-topic/service label', () => {
      beforeEach(() => {
        cy.mount(<Component service="Sub-topic Label" />)
      })

      it('should render the right text', () => {
        cy.get('[data-test="activity-service-label"]')
          .should('exist')
          .should('have.text', 'Sub-topic Label')
      })

      it('should have a blue colour label', () => {
        cy.get('[data-test="activity-service-label"]')
          .should('have.css', 'color', colours.blue.colour)
          .should('have.css', 'background-color', colours.blue.backgroundColour)
      })
    })
  })

  context('When it is an external activity', () => {
    context('When there is an activity/kind label', () => {
      beforeEach(() => {
        cy.mount(<Component isExternalActivity={true} kind="Activity Type" />)
      })

      it('should render the right text', () => {
        cy.get('[data-test="activity-kind-label"]')
          .should('exist')
          .should('have.text', 'Activity Type')
      })

      it('should have a grey label', () => {
        cy.get('[data-test="activity-kind-label"]')
          .should('have.css', 'color', colours.grey.colour)
          .should('have.css', 'background-color', colours.grey.backgroundColour)
      })
    })

    context('When there is an topic/theme label', () => {
      beforeEach(() => {
        cy.mount(<Component isExternalActivity={true} theme="Topic Label" />)
      })

      it('should render the right text', () => {
        cy.get('[data-test="activity-theme-label"]')
          .should('exist')
          .should('have.text', 'Topic Label')
      })

      it('should have the dark green colour label', () => {
        cy.get('[data-test="activity-theme-label"]')
          .should('have.css', 'color', colours.darkGreen.colour)
          .should(
            'have.css',
            'background-color',
            colours.darkGreen.backgroundColour
          )
      })
    })

    context('When there is a sub-topic/service label', () => {
      beforeEach(() => {
        cy.mount(
          <Component isExternalActivity={true} service="Sub-topic Label" />
        )
      })

      it('should render the right text', () => {
        cy.get('[data-test="activity-service-label"]')
          .should('exist')
          .should('have.text', 'Sub-topic Label')
      })

      it('should have a turquoise colour label', () => {
        cy.get('[data-test="activity-service-label"]')
          .should('have.css', 'color', colours.turquoise.colour)
          .should(
            'have.css',
            'background-color',
            colours.turquoise.backgroundColour
          )
      })
    })
  })
})
