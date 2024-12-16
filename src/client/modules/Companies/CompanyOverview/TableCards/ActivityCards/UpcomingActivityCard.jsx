import React from 'react'
import { connect } from 'react-redux'
import { endOfTomorrow } from 'date-fns'

import { COMPANIES__OVERVIEW_UPCOMING_ACTIVITY_LOADED } from '../../../../../actions'
import { formatDate, DATE_FORMAT_ISO } from '../../../../../utils/date-utils'
import { OVERVIEW_UPCOMING_ACTIVITY_ID, upcomingState2props } from './state'
import ActivityCard from './ActivityCard'

const UpcomingActivityCard = ({ company, results }) => (
  <ActivityCard
    company={company}
    numberOfItems={2}
    feedType="upcoming"
    results={results}
    stateId={OVERVIEW_UPCOMING_ACTIVITY_ID}
    action={COMPANIES__OVERVIEW_UPCOMING_ACTIVITY_LOADED}
    additionalPayload={{
      date_after: formatDate(endOfTomorrow(), DATE_FORMAT_ISO),
      sortby: 'date:asc',
    }}
  />
)

export default connect(upcomingState2props)(UpcomingActivityCard)
