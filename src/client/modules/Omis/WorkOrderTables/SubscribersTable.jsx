import React from 'react'
import { Link } from 'govuk-react'

import { SummaryTable } from '../../../components'
import { isOrderActive } from '../transformers'
import urls from '../../../../lib/urls'
import WideSummaryTableRow from '../../../../apps/companies/apps/business-details/client/WideSummaryTableRow'

const buildSubscriberRows = (subscribers) =>
  subscribers.map(({ name, ditTeam }) => (
    <WideSummaryTableRow key={name}>
      {name}
      {ditTeam?.ukRegion ? ', ' + ditTeam.ukRegion.name : ''}
    </WideSummaryTableRow>
  ))

const SubscribersTable = ({ subscribers, order }) => (
  <SummaryTable
    caption="Advisers in the UK"
    data-test="subscribers-table"
    actions={
      isOrderActive(order) && (
        <Link
          key="addSubscribersLink"
          href={urls.omis.edit.subscribers(order.id)}
          aria-label="Add or remove advisers in the UK"
          data-test="add-subscribers-link"
          noVisitedState={true}
        >
          Add or remove
        </Link>
      )
    }
  >
    {subscribers.length > 0 ? (
      buildSubscriberRows(subscribers)
    ) : (
      <WideSummaryTableRow>No advisers added</WideSummaryTableRow>
    )}
  </SummaryTable>
)

export default SubscribersTable
