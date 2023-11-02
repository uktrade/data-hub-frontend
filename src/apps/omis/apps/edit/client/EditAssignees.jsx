import React from 'react'
import { useParams } from 'react-router-dom'

import { TASK_SAVE_ORDER_ASSIGNEES } from './state'
import { transformAdvisersForTypeahead } from './transformers'
import {
  OrderAssigneesResource,
  OrderResource,
} from '../../../../../client/components/Resource'
import { EditAdvisersForm } from './EditAdvisersForm'
import OMISLayout from '../../../../../client/modules/Omis/OMISLayout'
import { STATUS } from '../../../../../client/modules/Omis/constants'

const EditAssignees = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OrderAssigneesResource id={orderId}>
          {(orderAssignees) => (
            <OMISLayout
              heading="Add or remove advisers in the market"
              order={order}
            >
              <EditAdvisersForm
                id="order-assignees-form"
                analyticsFormName="editOrderAssignees"
                initialValues={{
                  assignees: transformAdvisersForTypeahead(orderAssignees),
                }}
                submissionTaskName={TASK_SAVE_ORDER_ASSIGNEES}
                transformPayload={(values) => ({
                  values,
                  orderId,
                  canRemoveAssignees: order.status === STATUS.DRAFT,
                })}
                orderId={order.id}
                orderAdvisers={orderAssignees}
                typeaheadName="assignees"
                typeaheadHint="For example post advisers or other in-country staff"
                flashMessage="Advisers in the market updated"
              />
            </OMISLayout>
          )}
        </OrderAssigneesResource>
      )}
    </OrderResource>
  )
}

export default EditAssignees
