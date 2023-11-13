import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../components'
import Task from '../../components/Task'
import {
  OrderAssigneesResource,
  OrderResource,
} from '../../components/Resource'
import urls from '../../../lib/urls'
import { TASK_SET_LEAD_ADVISER, SET_LEAD_ADVISER_ID } from './state'

const SetLeadAdviser = () => {
  const { orderId, adviserId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <DefaultLayout
          heading="Set lead adviser in the market"
          pageTitle={`Set lead adviser in the market - ${order.reference} - Orders (OMIS)`}
          breadcrumbs={[
            {
              link: urls.dashboard.index(),
              text: 'Home',
            },
            {
              link: urls.omis.index(),
              text: 'Orders (OMIS)',
            },
            {
              link: urls.omis.order(orderId),
              text: order.reference,
            },
            {
              text: 'Set lead adviser in the market',
            },
          ]}
          useReactRouter={false}
        >
          <OrderAssigneesResource id={orderId}>
            {(assignees) => (
              <Task.Status
                name={TASK_SET_LEAD_ADVISER}
                id={SET_LEAD_ADVISER_ID}
                progressMessage="Setting lead adviser"
                startOnRender={{
                  payload: { orderId, adviserId, assignees },
                }}
              >
                {() => window.location.assign(urls.omis.order(orderId))}
              </Task.Status>
            )}
          </OrderAssigneesResource>
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default SetLeadAdviser
