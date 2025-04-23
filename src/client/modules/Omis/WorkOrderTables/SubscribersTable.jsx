import React from 'react'

import { SummaryTable } from '../../../components'
import { isOrderActive } from '../transformers'
import urls from '../../../../lib/urls'
import WideSummaryTableRow from '../../Companies/CompanyBusinessDetails/WideSummaryTableRow'
import AccessibleLink from '../../../components/Link'

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
        <AccessibleLink
          key="addSubscribersLink"
          href={urls.omis.edit.subscribers(order.id)}
          aria-label="Add or remove advisers in the UK"
          data-test="add-subscribers-link"
          noVisitedState={true}
        >
          Add or remove
        </AccessibleLink>
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
