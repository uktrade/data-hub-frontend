import React from 'react'

import AventriEventSyncWarning from '../../../../../../src/client/components/ActivityFeed/activities/AventriEventSyncWarning'

describe('AventriEventSyncWarning', () => {
  const Component = (props) => <AventriEventSyncWarning {...props} />
  context('when there is an aventri event id', () => {
    beforeEach(() => {
      cy.mount(<Component aventriEventId={1122} />)
    })

    it('renders link to aventri with the correct id', () => {
      cy.get('[data-test=newWindowLink]')
        .should('have.attr', 'href')
        .and('include', '1122')
    })
  })
})
