import React from 'react'
import { find } from 'lodash'
import PropTypes from 'prop-types'

import activities from './activities'

function Activity({
  activity,
  showDetails,
  showDnbHierarchy,
  filter,
  isContactActivitiesFeatureOn,
}) {
  const ActivityToRender = find(activities, (a) =>
    a.canRender(activity, filter)
  )

  if (!ActivityToRender) {
    return null
  }

  return (
    <ActivityToRender
      activity={activity}
      filter={filter}
      showDetails={showDetails}
      showDnbHierarchy={showDnbHierarchy}
      isContactActivitiesFeatureOn={isContactActivitiesFeatureOn}
    />
  )
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  showDetails: PropTypes.bool,
  showDnbHierarchy: PropTypes.bool,
  filter: PropTypes.array,
  isContactActivitiesFeatureOn: PropTypes.bool,
}

Activity.defaultProps = {
  showDetails: false,
  showDnbHierarchy: false,
  filter: [],
  isContactActivitiesFeatureOn: false,
}

export default Activity
