import React from 'react'

import SubscribersTable from '../../../../../../src/client/modules/Omis/WorkOrderTables/SubscribersTable'
import {
  assertLink,
  assertSummaryTable,
} from '../../../../../functional/cypress/support/assertions'
import { STATUS } from '../../../../../../src/client/modules/Omis/constants'
import urls from '../../../../../../src/lib/urls'

const order = {
  id: '123',
  status: STATUS.DRAFT,
}

const inactiveOrder = {
  status: STATUS.COMPLETE,
}

const subscribers = [
  { name: 'Andreas Test', ditTeam: { ukRegion: { name: 'East of England' } } },
  { name: 'Andrew Test', ditTeam: null },
]

describe('SubscribersTable', () => {
  context('When viewing an order with no subscribers', () => {
    beforeEach(() => {
      cy.mount(<SubscribersTable order={order} subscribers={[]} />)
    })

    it('should display the no subscribers message', () => {
      assertSummaryTable({
        dataTest: 'subscribers-table',
        heading: 'Advisers in the UK',
        showEditLink: true,
        content: { 'No advisers added': null },
        editLinkText: 'Add or remove',
      })
    })

    it('should display the add or remove link', () => {
      assertLink('add-subscribers-link', urls.omis.edit.subscribers(order.id))
    })
  })

  context('When viewing an order with subscribers', () => {
    beforeEach(() => {
      cy.mount(
        <SubscribersTable order={inactiveOrder} subscribers={subscribers} />
      )
    })

    it('should display the subscribers', () => {
      assertSummaryTable({
        dataTest: 'subscribers-table',
        heading: 'Advisers in the UK',
        showEditLink: false,
        content: { 'Andreas Test, East of England': null, 'Andrew Test': null },
        editLinkText: 'Add or remove',
      })
    })

    it('should not display the add or remove link', () => {
      cy.get('[data-test="add-subscribers-link"]').should('not.exist')
    })
  })

  context('When viewing an inactive order', () => {
    beforeEach(() => {
      cy.mount(
        <SubscribersTable order={inactiveOrder} subscribers={subscribers} />
      )
    })

    it('should display the subscribers and no edit link', () => {
      assertSummaryTable({
        dataTest: 'subscribers-table',
        heading: 'Advisers in the UK',
        showEditLink: false,
        content: { 'Andreas Test, East of England': null, 'Andrew Test': null },
        editLinkText: 'Add or remove',
      })
    })
  })
})
