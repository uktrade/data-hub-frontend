import React from 'react'
import { connect } from 'react-redux'

import ActivityCard from './ActivityCard'
import { OVERVIEW_RECENT_ACTIVITY_ID, recentState2props } from './state'
import { formatWithoutParsing, subtractMonths } from '../../../../../utils/date'
import { DATE_LONG_FORMAT_3 } from '../../../../../../common/constants'
import { COMPANIES__OVERVIEW_RECENT_ACTIVITY_LOADED } from '../../../../../actions'
import { FILTER_FEED_TYPE } from '../../../../../../apps/companies/apps/activity-feed/constants'

const RecentActivityCard = ({ company, results }) => (
  <ActivityCard
    company={company}
    numberOfItems={3}
    feedType={FILTER_FEED_TYPE.RECENT}
    results={results}
    stateId={OVERVIEW_RECENT_ACTIVITY_ID}
    action={COMPANIES__OVERVIEW_RECENT_ACTIVITY_LOADED}
    additionalPayload={{
      date_before: formatWithoutParsing(new Date(), DATE_LONG_FORMAT_3),
      date_after: formatWithoutParsing(
        subtractMonths(new Date(), 6),
        DATE_LONG_FORMAT_3
      ),
    }}
  />
)

export default connect(recentState2props)(RecentActivityCard)
