import React from 'react'
import PropTypes from 'prop-types'

import Main from '../../../../../client/components/Main'
import { TASK_SAVE_ORDER_SUBSCRIBERS } from './state'
import { transformSubscribersForTypeahead } from './transformers'
import OrderSubscribersResource from '../../../../../client/components/Resource/OrderSubscribers'
import { EditAdvisersLocalHeader, EditAdvisersForm } from './EditAdvisersForm'

const EditSubscribers = ({ reference, id, canRemoveSubscribers }) => (
  <OrderSubscribersResource id={id}>
    {(orderSubscribers) => (
      <>
        <EditAdvisersLocalHeader
          orderId={id}
          reference={reference}
          heading="Add or remove advisers in the UK"
          lastFieldText="Add or remove advisers in the UK"
        />
        <Main>
          <EditAdvisersForm
            id="order-subsrcibers-form"
            analyticsFormName="editOrderSubscribers"
            initialValues={{
              subscribers: transformSubscribersForTypeahead(orderSubscribers),
            }}
            submissionTaskName={TASK_SAVE_ORDER_SUBSCRIBERS}
            transformPayload={(values) => ({
              values,
              id,
              canRemoveSubscribers,
            })}
            orderAdvisers={orderSubscribers}
            orderId={id}
            typeaheadName="subscribers"
            typeaheadHint="People who need to be kept informed about this order, for example, international trade advisers or language advisors."
          />
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
