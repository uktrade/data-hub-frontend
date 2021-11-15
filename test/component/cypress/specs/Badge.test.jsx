import React from 'react'
import { mount } from '@cypress/react'
import Badge from '../../../../src/client/components/Badge'

describe('Badge', () => {
  const Component = (props) => <Badge {...props} />

  const badgeText = 'example'

  context('When no props are passed', () => {
    beforeEach(() => {
      mount(<Component>{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render with a default (grey) border', () => {
      cy.get('[data-test="badge"]').should(
        'have.css',
        'border',
        '2px solid rgb(191, 193, 195)'
      )
    })
  })

  context('When a "label" prop is passed passed', () => {
    beforeEach(() => {
      mount(<Component label="testLabel">{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render the label prop', () => {
      cy.get('[data-test="badge"]').should('contain', 'testLabel')
    })
  })

  context('When a "borderColour" prop is passed passed', () => {
    beforeEach(() => {
      mount(<Component borderColour="red">{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render with a red border', () => {
      cy.get('[data-test="badge"]').should(
        'have.css',
        'border',
        '2px solid rgb(255, 0, 0)'
      )
    })
  })
})
