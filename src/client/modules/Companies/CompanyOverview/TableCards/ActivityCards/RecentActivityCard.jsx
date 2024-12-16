import React from 'react'
import { connect } from 'react-redux'
import { subMonths } from 'date-fns'

import { COMPANIES__OVERVIEW_RECENT_ACTIVITY_LOADED } from '../../../../../actions'
import { formatDate, DATE_FORMAT_ISO } from '../../../../../utils/date-utils'
import { OVERVIEW_RECENT_ACTIVITY_ID, recentState2props } from './state'
import ActivityCard from './ActivityCard'

const RecentActivityCard = ({ company, results }) => (
  <ActivityCard
    company={company}
    numberOfItems={3}
    feedType="recent"
    results={results}
    stateId={OVERVIEW_RECENT_ACTIVITY_ID}
    action={COMPANIES__OVERVIEW_RECENT_ACTIVITY_LOADED}
    additionalPayload={{
      date_before: formatDate(new Date(), DATE_FORMAT_ISO),
      date_after: formatDate(subMonths(new Date(), 6), DATE_FORMAT_ISO),
    }}
  />
)

export default connect(recentState2props)(RecentActivityCard)
