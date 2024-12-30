import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FieldDate, FieldTextarea, Form, FormLayout } from '../../components'
import { OrderResource } from '../../components/Resource'
import urls from '../../../lib/urls'
import { state2props, TASK_EDIT_OMIS_QUOTE_INFORMATION } from './state'
import { FORM_LAYOUT } from '../../../common/constants'
import { transformQuoteInformationForApi } from './transformers'
import { transformDateStringToDateObject } from '../../../client/transformers'
import { validateIfDateInFuture } from './validators'
import OMISLayout from './OMISLayout'

const EditQuoteInformation = ({ csrfToken }) => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OMISLayout heading="Edit quote information" order={order}>
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="edit-order-quote-information"
              analyticsFormName="editOrderQuoteInformation"
              submitButtonLabel="Save and return"
              cancelButtonLabel="Return without saving"
              cancelRedirectTo={() => urls.omis.order(order.id)}
              flashMessage={() => 'Quote information updated'}
              redirectTo={() => urls.omis.order(order.id)}
              submissionTaskName={TASK_EDIT_OMIS_QUOTE_INFORMATION}
              transformPayload={(values) =>
                transformQuoteInformationForApi({
                  orderId,
                  csrfToken,
                  values,
                })
              }
            >
              <FieldTextarea
                type="text"
                name="description"
                label="Description of the work or activity"
                initialValue={order.description}
              />
              <FieldDate
                name="delivery_date"
                label="Delivery date of work"
                hint="For example 28 10 2018"
                initialValue={transformDateStringToDateObject(
                  order.deliveryDate
                )}
                validate={validateIfDateInFuture}
              />
            </Form>
          </FormLayout>
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default connect(state2props)(EditQuoteInformation)
