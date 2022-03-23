import React from 'react'
import { connect } from 'react-redux'
import { TASK_GET_CONTACT_INTERACTIONS, ID, state2props } from './state'
import { CONTACTS__INTERACTION_LIST_LOADED } from '../../../client/actions'
import Task from '../../../client/components/Task'
import Activity from '../../../client/components/ActivityFeed/Activity'

const ContactInteractionsApp = ({ contactId, activities }) => (
  <Task.Status
    name={TASK_GET_CONTACT_INTERACTIONS}
    id={ID}
    progressMessage="Loading Contact Interactions"
    startOnRender={{
      payload: contactId,
      onSuccessDispatch: CONTACTS__INTERACTION_LIST_LOADED,
    }}
  >
    {() =>
      activities &&
      activities.map((activity, index) => (
        <div key={`activity-${index}`}>
          <Activity activity={activity} />
        </div>
      ))
    }
  </Task.Status>
)

export default connect(state2props)(ContactInteractionsApp)
