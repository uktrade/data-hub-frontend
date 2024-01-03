import React from 'react'

import InternalUseTable from '../../../../../../src/client/modules/Omis/WorkOrderTables/InternalUseTable'
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

const orderExtraFields = {
  furtherInfo: 'Further info',
  existingAgents: 'Existing agents',
  contactsNotToApproach: 'Contacts not to approach',
  sector: {
    name: 'Advanced Engineering',
  },
  serviceTypes: [
    {
      name: 'Validated contacts',
    },
    {
      name: 'Visit programme',
    },
    {
      name: 'Strategic offer',
    },
  ],
}

const inactiveOrder = {
  status: STATUS.COMPLETE,
}

const orderWithAllFields = { ...order, ...orderExtraFields }

describe('InternalUseTable', () => {
  context('When viewing an order with no internal details', () => {
    beforeEach(() => {
      cy.mount(<InternalUseTable order={order} />)
    })

    it('should display the Not Set messages', () => {
      assertSummaryTable({
        dataTest: 'internal-use-table',
        heading: 'Internal use only',
        showEditLink: true,
        content: {
          'Service types': 'None selected',
          Sector: '',
          'Specific people or organisations the company does not want DBT to talk to':
            'None added',
        },
      })
    })

    it('should display the edit link', () => {
      assertLink(
        'edit-internal-info-link',
        urls.omis.edit.internalInfo(order.id)
      )
    })
  })

  context('When viewing an order with full internal details', () => {
    beforeEach(() => {
      cy.mount(<InternalUseTable order={orderWithAllFields} />)
    })

    it('should display the internal details', () => {
      assertSummaryTable({
        dataTest: 'internal-use-table',
        heading: 'Internal use only',
        showEditLink: true,
        content: {
          'Service types': orderWithAllFields.serviceTypes
            .map((type) => type.name)
            .join(', '),
          Sector: orderWithAllFields.sector.name,
          'Internal notes and useful information':
            orderWithAllFields.furtherInfo,
          'Contacts the company already has in the market':
            orderWithAllFields.existingAgents,
          'Specific people or organisations the company does not want DBT to talk to':
            orderWithAllFields.contactsNotToApproach,
        },
      })
    })

    it('should display the edit link', () => {
      assertLink(
        'edit-internal-info-link',
        urls.omis.edit.internalInfo(order.id)
      )
    })
  })

  context('When viewing an inactive order', () => {
    beforeEach(() => {
      cy.mount(<InternalUseTable order={inactiveOrder} />)
    })

    it('should display the Not Set messages and no edit link', () => {
      assertSummaryTable({
        dataTest: 'internal-use-table',
        heading: 'Internal use only',
        showEditLink: false,
        content: {
          'Service types': 'None selected',
          Sector: '',
          'Specific people or organisations the company does not want DBT to talk to':
            'None added',
        },
      })
    })
  })
})
