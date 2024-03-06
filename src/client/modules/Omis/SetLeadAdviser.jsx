import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import OMISLayout from './OMISLayout'
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
        <OMISLayout heading="Set lead adviser in the market" order={order}>
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
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default SetLeadAdviser
