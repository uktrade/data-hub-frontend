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
    // console.log('ActivityToRender')
    // console.log('activity', activity)
    // console.log('ativity json: ', JSON.stringify(activity))
    // console.log('a', a)
    // console.log('a.canRender', a.canRender)
    // console.log('typeof a.canRender', typeof a.canRender)

    if (a.canRender && typeof a.canRender == 'function') {
      // console.log('Happy happy')
      // console.log('a.canRender(activity, filter)')
      // console.log('result: ', a.canRender(activity, filter))
      a.canRender(activity, filter)
    } else {
      // console.log('No a.canRender')
      return null
    }
  })

  // console.log('ActivityToRender')
  // console.log(ActivityToRender)
  if (!ActivityToRender) {
    // console.log('return null')
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
