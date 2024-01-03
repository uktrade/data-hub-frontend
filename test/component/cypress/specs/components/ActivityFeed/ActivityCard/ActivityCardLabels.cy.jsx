import React from 'react'

import ActivityCardLabels from '../../../../../../../src/client/components/ActivityFeed/activities/card/ActivityCardLabels'

// this is needed as cypress can only test colours with rgb not hex
const colours = {
  default: {
    colour: 'rgb(255, 255, 255)',
    backgroundColour: 'rgb(29, 112, 184)',
  },
  grey: { colour: 'rgb(69, 74, 77)', backgroundColour: 'rgb(239, 240, 241)' },
  blue: { colour: 'rgb(20, 78, 129)', backgroundColour: 'rgb(210, 226, 241)' },
  darkGreen: {
    colour: 'rgb(255, 255, 255)',
    backgroundColour: 'rgb(16, 64, 60)',
  },
  turquoise: {
    colour: 'rgb(16, 64, 60)',
    backgroundColour: 'rgb(191, 227, 224)',
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

      it('should have the default colour label', () => {
        cy.get('[data-test="activity-theme-label"]')
          .should('have.css', 'color', colours.default.colour)
          .should(
            'have.css',
            'background-color',
            colours.default.backgroundColour
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
