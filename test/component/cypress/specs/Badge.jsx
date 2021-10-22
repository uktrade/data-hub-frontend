import React from 'react'
import { mount } from '@cypress/react'
import Badge from '../../../../src/client/components/Badge'
import { GREY_2 } from 'govuk-colours'

describe('Badge', () => {
  let wrapper

  const badgeText = 'example'

  context('When no props are passed', () => {
    beforeEach(() => {
      wrapper = mount(<Badge>{badgeText}</Badge>)
    })

    it('should set the content with children', () => {
      wrapper.should('have.text', 'example')
    })

    it('should render with a default (grey) border', () => {
      wrapper.its('borderColour').should('eq', GREY_2)
    })
  })

  context('When a "label" prop is passed passed', () => {
    beforeEach(() => {
      wrapper = mount(<Badge label="testLabel">{badgeText}</Badge>)
    })

    it('should set the content with children', () => {
      wrapper.should('have.text', 'example')
    })

    it('should render the label prop', () => {
      wrapper.should('have.text', 'testLabel')
    })
  })

  context('When a "borderColour" prop is passed passed', () => {
    beforeEach(() => {
      wrapper = mount(<Badge borderColour="red">{badgeText}</Badge>)
    })

    it('should set the content with children', () => {
      wrapper.should('have.text', 'example')
    })

    it('should render the label prop', () => {
      wrapper.should('have.text', 'testLabel')
    })

    it('should render with a red border', () => {
      wrapper.its('borderColour').should('eq', 'red')
    })
  })
})
