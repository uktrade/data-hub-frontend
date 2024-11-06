import React from 'react'

import Tag from '../../../../../src/client/components/Tag'
import { rgb } from '../../../../../src/client/utils/colours'

const Component = (props) => <Tag {...props} data-test="tag" />

const assertTagColours = ({ colourName, colour, backgroundColour }) => {
  context(`When the colour is set to ${colourName}`, () => {
    beforeEach(() => {
      cy.mount(<Component colour={colourName}>Test</Component>)
    })

    it('should render the text', () => {
      cy.get('[data-test=tag]').should('exist').should('have.text', 'Test')
    })

    it('should render with the correct colours', () => {
      cy.get('[data-test=tag]')
        .should('have.css', 'color', rgb(colour))
        .should('have.css', 'background-color', rgb(backgroundColour))
    })
  })
}

describe('Tag', () => {
  context('When the colour prop is not set', () => {
    beforeEach(() => {
      cy.mount(<Component>Test</Component>)
    })

    it('should render the text', () => {
      cy.get('[data-test=tag]').should('exist').should('have.text', 'Test')
    })

    it('should render with the blue default colours', () => {
      cy.get('[data-test=tag]')
        .should('have.css', 'color', rgb('#0c2d4a'))
        .should('have.css', 'background-color', rgb('#bbd4ea'))
    })
  })

  context('When the colour prop is set', () => {
    assertTagColours({
      colourName: 'grey',
      colour: '#282d30',
      backgroundColour: '#e5e6e7',
    })

    assertTagColours({
      colourName: 'green',
      colour: '#005a30',
      backgroundColour: '#cce2d8',
    })
    assertTagColours({
      colourName: 'turquoise',
      colour: '#10403c',
      backgroundColour: '#d4ecea',
    })
    assertTagColours({
      colourName: 'blue',
      colour: '#0c2d4a',
      backgroundColour: '#bbd4ea',
    })
    assertTagColours({
      colourName: 'lightBlue',
      colour: '#0c2d4a',
      backgroundColour: '#e8f1f8',
    })
    assertTagColours({
      colourName: 'purple',
      colour: '#491644',
      backgroundColour: '#efdfed',
    })
    assertTagColours({
      colourName: 'pink',
      colour: '#6b1c40',
      backgroundColour: '#f9e1ec',
    })
    assertTagColours({
      colourName: 'red',
      colour: '#2a0b06',
      backgroundColour: '#f4cdc6',
    })
    assertTagColours({
      colourName: 'orange',
      colour: '#6e3619',
      backgroundColour: '#fcd6c3',
    })
    assertTagColours({
      colourName: 'yellow',
      colour: '#594d00',
      backgroundColour: '#fff7bf',
    })
    assertTagColours({
      colourName: 'darkGreen',
      colour: '#ffffff',
      backgroundColour: '#10403c',
    })
    assertTagColours({
      colourName: 'govBlue',
      colour: '#ffffff',
      backgroundColour: '#1d70b8',
    })
  })
})
