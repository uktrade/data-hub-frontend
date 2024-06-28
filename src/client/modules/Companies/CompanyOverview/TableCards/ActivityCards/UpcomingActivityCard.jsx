import React from 'react'
import { connect } from 'react-redux'

import ActivityCard from './ActivityCard'
import { OVERVIEW_UPCOMING_ACTIVITY_ID, upcomingState2props } from './state'
import { formatWithoutParsing, tomorrow } from '../../../../../utils/date'
import { DATE_LONG_FORMAT_3 } from '../../../../../../common/constants'
import { COMPANIES__OVERVIEW_UPCOMING_ACTIVITY_LOADED } from '../../../../../actions'

const UpcomingActivityCard = ({ company, results }) => (
  <ActivityCard
    company={company}
    numberOfItems={2}
    feedType="upcoming"
    results={results}
    stateId={OVERVIEW_UPCOMING_ACTIVITY_ID}
    action={COMPANIES__OVERVIEW_UPCOMING_ACTIVITY_LOADED}
    additionalPayload={{
      date_after: formatWithoutParsing(tomorrow(), DATE_LONG_FORMAT_3),
      sortby: 'date:asc',
    }}
  />
)

export default connect(upcomingState2props)(UpcomingActivityCard)
