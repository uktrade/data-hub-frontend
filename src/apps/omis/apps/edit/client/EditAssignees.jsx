import React from 'react'
import PropTypes from 'prop-types'

import Main from '../../../../../client/components/Main'
import { TASK_SAVE_ORDER_ASSIGNEES } from './state'
import { transformAdvisersForTypeahead } from './transformers'
import OrderAssigneesResource from '../../../../../client/components/Resource/OrderAssignees'
import { EditAdvisersLocalHeader, EditAdvisersForm } from './EditAdvisersForm'

const EditAssignees = ({ reference, id, canRemoveAssignees }) => (
  <OrderAssigneesResource id={id}>
    {(orderAssignees) => (
      <>
        <EditAdvisersLocalHeader
          orderId={id}
          reference={reference}
          heading="Add or remove advisers in the market"
          lastFieldText="Add or remove advisers in the market"
        />
        <Main>
          <EditAdvisersForm
            id="order-assignees-form"
            analyticsFormName="editOrderAssignees"
            initialValues={{
              assignees: transformAdvisersForTypeahead(orderAssignees),
            }}
            submissionTaskName={TASK_SAVE_ORDER_ASSIGNEES}
            transformPayload={(values) => ({
              values,
              id,
              canRemoveAssignees,
            })}
            orderId={id}
            orderAdvisers={orderAssignees}
            typeaheadName="assignees"
            typeaheadHint="For example post advisers or other in-country staff"
          />
        </Main>
      </>
    )}
  </OrderAssigneesResource>
)

EditAssignees.propTypes = {
  reference: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  canRemoveAssignees: PropTypes.bool.isRequired,
}

export default EditAssignees
