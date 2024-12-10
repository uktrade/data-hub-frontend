import React from 'react'
import { Link } from 'govuk-react'

import { SummaryTable } from '../../../components'
import { canEditOrder } from '../transformers'
import { formatDate, DATE_FORMAT_MEDIUM } from '../../../utils/date-utils'
import urls from '../../../../lib/urls'

const QuoteInformationTable = ({ order }) => (
  <SummaryTable
    caption="Information for the quote"
    data-test="quote-info-table"
    actions={
      canEditOrder(order) && (
        <Link
          key="editQuoteInfoLink"
          href={urls.omis.edit.quote(order.id)}
          data-test="edit-quote-info-link"
          noVisitedState={true}
        >
          Edit
        </Link>
      )
    }
  >
    <SummaryTable.Row heading="Delivery date">
      {order.deliveryDate
        ? formatDate(order.deliveryDate, DATE_FORMAT_MEDIUM)
        : 'Not set'}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Description of the activity">
      {order.description || 'Not added'}
    </SummaryTable.Row>
  </SummaryTable>
)

export default QuoteInformationTable
