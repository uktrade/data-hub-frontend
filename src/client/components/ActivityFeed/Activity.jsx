import React from 'react'
import { find } from 'lodash'
import PropTypes from 'prop-types'

import activities from './activities'

function Activity({
  activity,
  showDetails,
  showDnbHierarchy,
  filter,
  isExportEnquiriesEnabled,
}) {
  const ActivityToRender = find(activities, (a) =>
    a.canRender(activity, filter, isExportEnquiriesEnabled)
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
    />
  )
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  showDetails: PropTypes.bool,
  showDnbHierarchy: PropTypes.bool,
  isExportEnquiriesEnabled: PropTypes.bool,
  filter: PropTypes.array,
}

Activity.defaultProps = {
  showDetails: false,
  showDnbHierarchy: false,
  isExportEnquiriesEnabled: false,
  filter: [],
}

export default Activity
