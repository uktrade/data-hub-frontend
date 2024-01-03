import React from 'react'

import Tag from '../../../../../src/client/components/Tag'

const Component = (props) => <Tag {...props} data-test="tag" />

describe('Tag', () => {
  context('When the colour prop is not set', () => {
    beforeEach(() => {
      cy.mount(<Component>Test</Component>)
    })

    it('should render the text', () => {
      cy.get('[data-test=tag]').should('exist').should('have.text', 'Test')
    })

    it('should render with the default colours', () => {
      cy.get('[data-test=tag]')
        .should('have.css', 'color', 'rgb(255, 255, 255)')
        .should('have.css', 'background-color', 'rgb(29, 112, 184)')
    })
  })

  context('When the colour prop is set', () => {
    assertTagColours('grey', 'rgb(69, 74, 77)', 'rgb(239, 240, 241)')
    assertTagColours('green', 'rgb(0, 90, 48)', 'rgb(204, 226, 216)')
    assertTagColours('turquoise', 'rgb(16, 64, 60)', 'rgb(191, 227, 224)')
    assertTagColours('blue', 'rgb(20, 78, 129)', 'rgb(210, 226, 241)')
    assertTagColours('purple', 'rgb(61, 35, 117)', 'rgb(219, 213, 233)')
    assertTagColours('pink', 'rgb(128, 34, 77)', 'rgb(247, 215, 230)')
    assertTagColours('red', 'rgb(148, 37, 20)', 'rgb(246, 215, 210)')
    assertTagColours('orange', 'rgb(110, 54, 25)', 'rgb(252, 214, 195)')
    assertTagColours('yellow', 'rgb(89, 77, 0)', 'rgb(255, 247, 191)')
  })
})

function assertTagColours(
  colour,
  expectedTextColour,
  expectedBackgroundColour
) {
  context(`When the colour is set to ${colour}`, () => {
    beforeEach(() => {
      cy.mount(<Component colour={colour}>Test</Component>)
    })

    it('should render the text', () => {
      cy.get('[data-test=tag]').should('exist').should('have.text', 'Test')
    })

    it('should render with the correct colours', () => {
      cy.get('[data-test=tag]')
        .should('have.css', 'color', expectedTextColour)
        .should('have.css', 'background-color', expectedBackgroundColour)
    })
  })
}
