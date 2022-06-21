import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { TASK_GET_EVENT_AVENTRI_DETAILS, ID, state2props } from './state'
import { EVENTS__AVENTRI_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import { DefaultLayout } from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { CONTACT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'

const EventAventriDetails = ({ name }) => {
  const { aventriEventId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.events.index(),
      text: 'Events',
    },
    {
      text: name,
    },
  ]

  return (
    <DefaultLayout
      heading="Events"
      pageTitle="Events"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <CheckUserFeatureFlag userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          isFeatureFlagEnabled && (
            <Task.Status
              name={TASK_GET_EVENT_AVENTRI_DETAILS}
              id={ID}
              progressMessage="loading event aventri details"
              startOnRender={{
                payload: aventriEventId,
                onSuccessDispatch: EVENTS__AVENTRI_DETAILS_LOADED,
              }}
            >
              {() => {
                return (
                  <></>
                  // TODO: Implements events aventri details here
                )
              }}
            </Task.Status>
          )
        }
      </CheckUserFeatureFlag>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventAventriDetails)
