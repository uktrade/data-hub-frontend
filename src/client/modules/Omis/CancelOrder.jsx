import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import { FieldRadios, Form } from '../../components'
import {
  OrderResource,
  OrderCancellationReasonsResource,
} from '../../components/Resource'
import ResourceOptionsField from '../../components/Form/elements/ResourceOptionsField'
import urls from '../../../lib/urls'
import { idNamesToValueLabels } from '../../utils'
import { RED_2 } from '../../utils/colours'
import { TASK_CANCEL_ORDER } from './state'
import { transformCancellationForApi } from './transformers'
import OMISLayout from './OMISLayout'

const CancelOrder = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OMISLayout heading="Cancel an order" order={order}>
          <Form
            id="cancel-order"
            analyticsFormName="cancelOrder"
            submitButtonLabel="Cancel order"
            cancelButtonLabel="Return without cancelling"
            cancelRedirectTo={() => urls.omis.order(order.id)}
            flashMessage={() => 'Order cancelled'}
            redirectTo={() => urls.omis.order(order.id)}
            submitButtonColour={RED_2}
            submissionTaskName={TASK_CANCEL_ORDER}
            transformPayload={(values) =>
              transformCancellationForApi({
                orderId,
                values,
              })
            }
          >
            <ResourceOptionsField
              name="cancellation_reason"
              label="Reason for cancelling"
              resource={OrderCancellationReasonsResource}
              field={FieldRadios}
              required="Please select the reason why this order is being cancelled"
              resultToOptions={(result) =>
                idNamesToValueLabels(
                  result.filter((option) => !option.disabledOn)
                )
              }
            />
          </Form>
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default CancelOrder
