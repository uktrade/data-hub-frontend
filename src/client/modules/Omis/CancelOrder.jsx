import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout, FieldRadios, Form } from '../../components'
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

const CancelOrder = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <DefaultLayout
          heading="Cancel an order"
          pageTitle={`Cancel an order - ${order.reference} - Orders (OMIS)`}
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
              link: urls.omis.order(order.id),
              text: order.reference,
            },
            { text: 'Cancel an order' },
          ]}
        >
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
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default CancelOrder
