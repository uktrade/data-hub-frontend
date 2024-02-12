import React from 'react'
import { useParams } from 'react-router-dom'

import {
  FieldTypeahead,
  Form,
  FormLayout,
  StatusMessage,
  ContactInformation,
} from '../../components'
import {
  CompanyContactsResource,
  OrderResource,
} from '../../components/Resource'
import ResourceOptionsField from '../../components/Form/elements/ResourceOptionsField'

import urls from '../../../lib/urls'
import { transformArrayIdNameToValueLabel } from '../../transformers'
import { transformObjectForTypeahead } from '../Investments/Projects/transformers'
import { STATUS } from './constants'
import { FORM_LAYOUT } from '../../../common/constants'
import { TASK_EDIT_ORDER_CONTACT } from './state'
import { transformContactForApi } from './transformers'
import OMISLayout from './OMISLayout'

const EditContact = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OMISLayout heading="Edit contact" order={order}>
          <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
            <Form
              id="edit-order-contact"
              analyticsFormName="editOrderContact"
              submitButtonLabel="Save and return"
              cancelButtonLabel="Return without saving"
              cancelRedirectTo={() => urls.omis.order(order.id)}
              flashMessage={() => 'Contact updated'}
              redirectTo={() => urls.omis.order(order.id)}
              submissionTaskName={TASK_EDIT_ORDER_CONTACT}
              transformPayload={(values) =>
                transformContactForApi({
                  orderId: order.id,
                  values,
                })
              }
            >
              <ResourceOptionsField
                id={order.company.id}
                name="contact"
                label="Contact responsible for the order"
                required="Select the contact responsible for this order"
                placeholder="Select a contact"
                resource={CompanyContactsResource}
                field={FieldTypeahead}
                resultToOptions={({ results }) =>
                  transformArrayIdNameToValueLabel(results)
                }
                initialValue={transformObjectForTypeahead(order.contact)}
              />

              <ContactInformation
                companyId={order.company.id}
                redirectMode="soft"
              />

              {order.status !== STATUS.DRAFT && (
                <StatusMessage data-test="notification-message">
                  Changing the contact will change who notifications are sent
                  to.
                  <br />
                  <br />
                  It will not change the contact details on the quote.
                </StatusMessage>
              )}
            </Form>
          </FormLayout>
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default EditContact
