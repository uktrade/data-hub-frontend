import React from 'react'
import { mount } from '@cypress/react'
import NewWindowLink from '../../../../src/client/components/NewWindowLink'

describe('NewWindowLink', () => {
  let wrapper
  const link = 'https://example.com'
  const linkText = 'example'
  const newTabText = 'opens in a new window or tab'

  context('when the "href" prop is passed', () => {
    before(() => {
      wrapper = mount(<NewWindowLink href={link}>{linkText}</NewWindowLink>)
    })

    it('should render the link', () => {
      wrapper.its('aria-label').should('eq', 'Opens in a new window or tab')
      wrapper.its('href').should('eq', link)
      wrapper.should('have.text', linkText)
      wrapper.should('have.text', newTabText)
    })
  })
})
