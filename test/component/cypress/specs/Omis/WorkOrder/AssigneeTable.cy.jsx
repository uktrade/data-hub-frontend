import React from 'react'

import AssigneesTable from '../../../../../../src/client/modules/Omis/WorkOrderTables/AssigneesTable'
import {
  assertGovReactTable,
  assertLinkWithText,
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

const assignees = [
  {
    adviser: {
      name: 'Andreas Test',
    },
    estimatedTime: 60,
    isLead: true,
  },
  {
    adviser: {
      name: 'Andrew Test',
    },
    estimatedTime: 120,
    isLead: false,
  },
  {
    adviser: {
      name: 'Andras Test',
    },
    estimatedTime: 0,
    isLead: false,
  },
]

describe('AssigneesTable', () => {
  context('When viewing an order with no assignees', () => {
    beforeEach(() => {
      cy.mount(<AssigneesTable order={order} assignees={[]} />)
    })

    it('should render the no advisers message', () => {
      assertGovReactTable({
        element: '[data-test="assignees-table"]',
        heading: 'Advisers in the market',
        rows: [['No advisers added']],
      })
    })

    it('should render the assignee time link', () => {
      assertLinkWithText(
        'assignee-time-link',
        urls.omis.edit.assigneeTime(order.id),
        'Estimate hours'
      )
    })

    it('should render the add assignees link', () => {
      assertLinkWithText(
        'add-assignees-link',
        urls.omis.edit.assignees(order.id),
        'Add'
      )
    })
  })

  context('When viewing an order with assignees', () => {
    beforeEach(() => {
      cy.mount(<AssigneesTable order={order} assignees={assignees} />)
    })

    it('should render the assignee details', () => {
      assertGovReactTable({
        element: '[data-test="assignees-table"]',
        heading: 'Advisers in the market',
        rows: [
          [`${assignees[0].adviser.name} Lead adviser`, '', '1 hour'],
          [assignees[1].adviser.name, 'Set as lead adviser', '2 hours'],
          [
            assignees[2].adviser.name,
            'Set as lead adviser',
            'No hours estimated',
          ],
          ['', '', '3 hoursestimated in total'],
        ],
      })
    })

    it('should render the assignee time link', () => {
      assertLinkWithText(
        'assignee-time-link',
        urls.omis.edit.assigneeTime(order.id),
        'Estimate hours'
      )
    })

    it('should render the add assignees link', () => {
      assertLinkWithText(
        'add-assignees-link',
        urls.omis.edit.assignees(order.id),
        'Add or remove'
      )
    })
  })

  context('When viewing an inactive order', () => {
    beforeEach(() => {
      cy.mount(<AssigneesTable order={inactiveOrder} assignees={[]} />)
    })

    it('should not render the links', () => {
      cy.get('[data-test="assignee-time-link"]').should('not.exist')
      cy.get('[data-test="add-assignees-link"]').should('not.exist')
    })
  })
})
