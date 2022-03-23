import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { TASK_GET_CONTACT_INTERACTIONS, ID, state2props } from './state'
import { CONTACTS__INTERACTION_LIST_LOADED } from '../../../client/actions'
import Task from '../../../client/components/Task'
import Activity from '../../../client/components/ActivityFeed/Activity'
import { SPACING } from '@govuk-react/constants'

const ContactInteractionsList = styled('ol')`
  list-style-type: none;
  padding: 0;
  margin-top: ${SPACING.SCALE_2};

  & > li {
    margin-bottom: ${SPACING.SCALE_2};
  }
`

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
      activities && (
        <ContactInteractionsList>
          {activities.map((activity, index) => (
            <li key={`activity-${index}`}>
              <Activity activity={activity} />
            </li>
          ))}
        </ContactInteractionsList>
      )
    }
  </Task.Status>
)

export default connect(state2props)(ContactInteractionsApp)
