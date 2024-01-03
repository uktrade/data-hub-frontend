import React from 'react'
import Link from '@govuk-react/link'

import ActivityCardSubject from '../../../../../../../src/client/components/ActivityFeed/activities/card/ActivityCardSubject'

describe('ActivityCardSubject', () => {
  const Component = (props) => <ActivityCardSubject {...props} />
  const subject = 'My Awesome Subject'

  context('When the subject does not link anywhere', () => {
    it('should show the subject with default colour', () => {
      cy.mount(<Component>{subject}</Component>)
      cy.get('[data-test="activity-card-subject"]')
        .should('have.text', 'My Awesome Subject')
        .should('have.css', 'color', 'rgb(0, 0, 0)')
    })
  })

  context('When the subject contains a link', () => {
    beforeEach(() => {
      cy.mount(
        <Component>
          <Link href="www.cool-website.com">{subject}</Link>
        </Component>
      )
    })

    it('should show the subject', () => {
      cy.get('[data-test="activity-card-subject"]').should(
        'have.text',
        'My Awesome Subject'
      )
    })

    it('should show the link as the right colour', () => {
      cy.get('[data-test="activity-card-subject"] > a').should(
        'have.css',
        'color',
        'rgb(29, 112, 184)'
      )
    })
  })
})
