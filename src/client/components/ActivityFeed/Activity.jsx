import React from 'react'
import { find } from 'lodash'
import PropTypes from 'prop-types'

import activities from './activities'

function Activity({
  activity,
  showDetails,
  showDnbHierarchy,
  filter,
  isOverview,
}) {
  const ActivityToRender = find(activities, (a) => {
    if (a.canRender && typeof a.canRender == 'function') {
      return a.canRender(activity, filter)
    } else {
      return null
    }
  })

  if (!ActivityToRender) {
    return null
  }
  return (
    <ActivityToRender
      activity={activity}
      filter={filter}
      showDetails={showDetails}
      showDnbHierarchy={showDnbHierarchy}
      isOverview={isOverview}
    />
  )
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  showDetails: PropTypes.bool,
  showDnbHierarchy: PropTypes.bool,
  filter: PropTypes.array,
}

Activity.defaultProps = {
  showDetails: false,
  showDnbHierarchy: false,
  filter: [],
}

export default Activity
