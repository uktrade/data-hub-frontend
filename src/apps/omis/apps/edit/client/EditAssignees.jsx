import React from 'react'
import PropTypes from 'prop-types'

import Main from '../../../../../client/components/Main'
import {
  FieldAdvisersTypeahead,
  Form,
  LocalHeader,
} from '../../../../../client/components'
import urls from '../../../../../lib/urls.js'
// TODO: Remove TASK_GET_ORDER_ASSIGNEES and associated task
import { TASK_SAVE_ORDER_ASSIGNEES } from './state'
import { transformAdvisersForTypeahead } from './transformers'
import OrderAssigneesResource from '../../../../../client/components/Resource/OrderAssignees'

const EditAssignees = ({ reference, id, canRemoveAssignees }) => (
  <OrderAssigneesResource id={id}>
    {(orderAssignees) => (
      <>
        <LocalHeader
          heading="Add or remove advisers in the market"
          breadcrumbs={[
            { link: urls.dashboard(), text: 'Home' },
            { link: urls.omis.index(), text: 'Orders (OMIS)' },
            { link: urls.omis.workOrder(id), text: reference },
            { text: 'Add or remove advisers in the market' },
          ]}
        />
        <Main>
          <Form
            id="order-assignees-form"
            analyticsFormName="editOrderAssignees"
            submitButtonLabel="Save and return"
            cancelRedirectTo={() => urls.omis.workOrder(id)}
            cancelButtonLabel="Return without saving"
            initialValues={{
              assignees: transformAdvisersForTypeahead(orderAssignees),
            }}
            submissionTaskName={TASK_SAVE_ORDER_ASSIGNEES}
            redirectTo={() => urls.omis.workOrder(id)}
            flashMessage={() => 'Changes saved'}
            transformPayload={(values) => ({
              values,
              id,
              canRemoveAssignees,
            })}
          >
            <FieldAdvisersTypeahead
              name="assignees"
              label="Adviser"
              /* check if order has previous assignees, 
                  if not enable validation
                */
              required={
                orderAssignees.length ? null : 'Enter at least one team member'
              }
              placeholder="Search team member"
              hint="For example post advisers or other in-country staff"
              isMulti={true}
            />
          </Form>
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
