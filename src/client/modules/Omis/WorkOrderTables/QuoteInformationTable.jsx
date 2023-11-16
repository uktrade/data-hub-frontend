import React from 'react'
import { Link } from 'govuk-react'

import { SummaryTable } from '../../../components'
import { canEditOrder } from '../transformers'
import { formatMediumDate } from '../../../utils/date'
import urls from '../../../../lib/urls'

const QuoteInformationTable = ({ order }) => (
  <SummaryTable
    caption="Information for the quote"
    data-test="quote-info-table"
    actions={
      canEditOrder(order) && (
        <Link
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
      {formatMediumDate(order.deliveryDate) || 'Not set'}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Description of the activity">
      {order.description || 'Not added'}
    </SummaryTable.Row>
  </SummaryTable>
)

export default QuoteInformationTable
