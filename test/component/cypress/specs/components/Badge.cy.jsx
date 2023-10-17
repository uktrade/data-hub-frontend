import React from 'react'
import { FONT_SIZE } from '@govuk-react/constants'

import Badge from '../../../../../src/client/components/Badge'

describe('Badge', () => {
  const Component = (props) => <Badge {...props} />

  const badgeText = 'example'

  context('When no props are passed', () => {
    beforeEach(() => {
      cy.mount(<Component>{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render with the default border colour', () => {
      cy.get('[data-test="badge"]').should(
        'have.css',
        'border',
        '2px solid rgb(191, 193, 195)'
      )
    })

    it('should render with the default text colour', () => {
      cy.get('[data-test="badge"]').should(
        'have.css',
        'color',
        'rgb(11, 12, 12)'
      )
    })

    it('should render with the default font size', () => {
      cy.get('[data-test="badge"]').should('have.css', 'font-size', '14px')
    })
  })

  context('When the label is set', () => {
    beforeEach(() => {
      cy.mount(<Component label="testLabel">{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render the label prop', () => {
      cy.get('[data-test="badge"]').should('contain', 'testLabel')
    })
  })

  context('When the border colour is set', () => {
    beforeEach(() => {
      cy.mount(<Component borderColour="red">{badgeText}</Component>)
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

  context('When the text colour is set', () => {
    beforeEach(() => {
      cy.mount(<Component textColour="red">{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render with red text', () => {
      cy.get('[data-test="badge"]').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)'
      )
    })
  })

  context('When the font size is set', () => {
    beforeEach(() => {
      cy.mount(<Component fontSize={FONT_SIZE.SIZE_27}>{badgeText}</Component>)
    })

    it('should set the content with children', () => {
      cy.get('[data-test="badge"]').should('contain', 'example')
    })

    it('should render with size 27 font', () => {
      cy.get('[data-test="badge"]').should('have.css', 'font-size', '27px')
    })
  })
})
