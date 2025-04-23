import React from 'react'
import { useParams } from 'react-router-dom'
import { Details } from 'govuk-react'

import {
  FieldTypeahead,
  Form,
  FormLayout,
  StatusMessage,
} from '../../components'
import {
  CompanyContactsResource,
  OrderResource,
} from '../../components/Resource'
import Task from '../../components/Task'
import ResourceOptionsField from '../../components/Form/elements/ResourceOptionsField'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../components/ContactForm/state'

import urls from '../../../lib/urls'
import { transformArrayIdNameToValueLabel } from '../../transformers'
import { transformObjectForTypeahead } from '../Investments/Projects/transformers'
import { STATUS } from './constants'
import { FORM_LAYOUT } from '../../../common/constants'
import { TASK_EDIT_ORDER_CONTACT, EDIT_CONTACT_ID } from './state'
import { transformContactForApi } from './transformers'
import OMISLayout from './OMISLayout'
import AccessibleLink from '../../components/Link'

const AddNewContact = ({ order }) => (
  <Task>
    {(getTask) => {
      const openContactFormTask = getTask(
        TASK_REDIRECT_TO_CONTACT_FORM,
        EDIT_CONTACT_ID
      )
      const redirectUrl = urls.contacts.create(order.company.id, {
        origin_url: window.location.pathname,
        origin_search: btoa(window.location.search),
      })

      const onOpenContactForm = ({ redirectUrl }) => {
        openContactFormTask.start({
          payload: {
            url: redirectUrl,
            storeId: EDIT_CONTACT_ID,
          },
        })
      }

      return (
        <Details
          summary="Is the contact you are looking for not listed?"
          data-test="contact-not-listed"
        >
          If the contact you are looking for is not listed you can{' '}
          <AccessibleLink
            data-test="add-a-new-contact-link"
            onClick={(e) => {
              e.preventDefault()
              onOpenContactForm({ event: e, redirectUrl })
            }}
            href={redirectUrl}
          >
            add a new contact
          </AccessibleLink>
          .
        </Details>
      )
    }}
  </Task>
)

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

              <AddNewContact order={order} />

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
