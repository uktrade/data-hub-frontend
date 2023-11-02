import React from 'react'
import { useParams } from 'react-router-dom'

import { TASK_SAVE_ORDER_SUBSCRIBERS } from './state'
import { transformSubscribersForTypeahead } from './transformers'
import {
  OrderSubscribersResource,
  OrderResource,
} from '../../components/Resource'
import { EditAdvisersForm } from './EditAdvisersForm'
import OMISLayout from './OMISLayout'
import { STATUS } from './constants'

const EditSubscribers = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OrderSubscribersResource id={order.id}>
          {(orderSubscribers) => (
            <OMISLayout
              heading="Add or remove advisers in the UK"
              order={order}
            >
              <EditAdvisersForm
                id="order-subsrcibers-form"
                analyticsFormName="editOrderSubscribers"
                initialValues={{
                  subscribers:
                    transformSubscribersForTypeahead(orderSubscribers),
                }}
                submissionTaskName={TASK_SAVE_ORDER_SUBSCRIBERS}
                transformPayload={(values) => ({
                  values,
                  id: order.id,
                  canRemoveSubscribers: order.status === STATUS.DRAFT,
                })}
                orderAdvisers={orderSubscribers}
                orderId={order.id}
                typeaheadName="subscribers"
                typeaheadHint="People who need to be kept informed about this order, for example, international trade advisers or language advisors."
                flashMessage="Advisers in the UK updated"
              />
            </OMISLayout>
          )}
        </OrderSubscribersResource>
      )}
    </OrderResource>
  )
}

export default EditSubscribers
