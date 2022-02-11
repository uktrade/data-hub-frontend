import React from 'react'
import PropTypes from 'prop-types'

import Main from '../../../../../client/components/Main'
import {
  FieldAdvisersTypeahead,
  Form,
  LocalHeader,
} from '../../../../../client/components'
import urls from '../../../../../lib/urls.js'
import { TASK_SAVE_ORDER_SUBSCRIBERS } from './state'
import { transformSubscribersForTypeahead } from './transformers'
import OrderSubscribersResource from '../../../../../client/components/Resource/OrderSubscribers'

const EditSubscribers = ({ reference, id, canRemoveSubscribers }) => (
  <OrderSubscribersResource id={id}>
    {(orderSubscribers) => (
      <>
        <LocalHeader
          heading="Add or remove advisers in the UK"
          breadcrumbs={[
            { link: urls.dashboard(), text: 'Home' },
            { link: urls.omis.index(), text: 'Orders (OMIS)' },
            { link: urls.omis.workOrder(id), text: reference },
            { text: 'Add or remove advisers in the UK' },
          ]}
        />
        <Main>
          <Form
            id="order-subsrcibers-form"
            analyticsFormName="editOrderSubscribers"
            submitButtonLabel="Save and return"
            cancelRedirectTo={() => urls.omis.workOrder(id)}
            cancelButtonLabel="Return without saving"
            initialValues={{
              subscribers: transformSubscribersForTypeahead(orderSubscribers),
            }}
            submissionTaskName={TASK_SAVE_ORDER_SUBSCRIBERS}
            redirectTo={() => urls.omis.workOrder(id)}
            flashMessage={() => 'Changes saved'}
            transformPayload={(values) => ({
              values,
              id,
              canRemoveSubscribers,
            })}
          >
            <FieldAdvisersTypeahead
              name="subscribers"
              label="Adviser"
              /* check if order has previous assignees,
                  if not enable validation
                */
              required={
                orderSubscribers.length
                  ? null
                  : 'Enter at least one team member'
              }
              placeholder="Search team member"
              hint="People who need to be kept informed about this order, for example, international trade advisers or language advisors."
              isMulti={true}
            />
          </Form>
        </Main>
      </>
    )}
  </OrderSubscribersResource>
)

EditSubscribers.propTypes = {
  reference: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  canRemoveSubscribers: PropTypes.bool.isRequired,
}

export default EditSubscribers
