import React from 'react'

import { SummaryTable } from '../../../components'
import { canEditOrder } from '../transformers'
import urls from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const InternalUseTable = ({ order }) => (
  <SummaryTable
    caption="Internal use only"
    data-test="internal-use-table"
    actions={
      canEditOrder(order) && (
        <AccessibleLink
          key="editInternalInfoLink"
          href={urls.omis.edit.internalInfo(order.id)}
          data-test="edit-internal-info-link"
          noVisitedState={true}
        >
          Edit
        </AccessibleLink>
      )
    }
  >
    <SummaryTable.Row heading="Service types">
      {order.serviceTypes?.length > 0
        ? order.serviceTypes.map((type) => type.name).join(', ')
        : 'None selected'}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Sector" hideWhenEmpty={false}>
      {order.sector?.name}
    </SummaryTable.Row>
    <SummaryTable.Row
      heading="Internal notes and useful information"
      hideWhenEmpty={true}
    >
      {order.furtherInfo}
    </SummaryTable.Row>
    <SummaryTable.Row
      heading="Contacts the company already has in the market"
      hideWhenEmpty={true}
    >
      {order.existingAgents}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Specific people or organisations the company does not want DBT to talk to">
      {order.contactsNotToApproach || 'None added'}
    </SummaryTable.Row>
  </SummaryTable>
)

export default InternalUseTable
