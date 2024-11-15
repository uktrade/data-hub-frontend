import React from 'react'

import QuoteInformationTable from '../../../../../../src/client/modules/Omis/WorkOrderTables/QuoteInformationTable'
import {
  assertLink,
  assertSummaryTable,
} from '../../../../../functional/cypress/support/assertions'
import { STATUS } from '../../../../../../src/client/modules/Omis/constants'
import urls from '../../../../../../src/lib/urls'
import { formatMediumDateParsed } from '../../../../../../src/client/utils/date'

const order = {
  id: '123',
  status: STATUS.DRAFT,
}

const orderExtraFields = {
  deliveryDate: '2017-07-26T14:08:36.380979',
  description: 'A description for the order',
}

const inactiveOrder = {
  status: STATUS.COMPLETE,
}

const orderWithAllFields = { ...order, ...orderExtraFields }

describe('QuoteInformationTable', () => {
  context('When viewing an order with no quote info', () => {
    beforeEach(() => {
      cy.mount(<QuoteInformationTable order={order} />)
    })

    it('should display the Not Set messages', () => {
      assertSummaryTable({
        dataTest: 'quote-info-table',
        heading: 'Information for the quote',
        showEditLink: true,
        content: {
          'Delivery date': 'Not set',
          'Description of the activity': 'Not added',
        },
      })
    })

    it('should display the edit link', () => {
      assertLink('edit-quote-info-link', urls.omis.edit.quote(order.id))
    })
  })

  context('When viewing an order with all quote info', () => {
    beforeEach(() => {
      cy.mount(<QuoteInformationTable order={orderWithAllFields} />)
    })

    it('should display the quote information', () => {
      assertSummaryTable({
        dataTest: 'quote-info-table',
        heading: 'Information for the quote',
        showEditLink: true,
        content: {
          'Delivery date': formatMediumDateParsed(
            orderWithAllFields.deliveryDate
          ),
          'Description of the activity': orderWithAllFields.description,
        },
      })
    })

    it('should display the edit link', () => {
      assertLink('edit-quote-info-link', urls.omis.edit.quote(order.id))
    })
  })

  context('When viewing an inactive order', () => {
    beforeEach(() => {
      cy.mount(<QuoteInformationTable order={inactiveOrder} />)
    })

    it('should display the Not Set messages and no edit link', () => {
      assertSummaryTable({
        dataTest: 'quote-info-table',
        heading: 'Information for the quote',
        showEditLink: false,
        content: {
          'Delivery date': 'Not set',
          'Description of the activity': 'Not added',
        },
      })
    })
  })
})
