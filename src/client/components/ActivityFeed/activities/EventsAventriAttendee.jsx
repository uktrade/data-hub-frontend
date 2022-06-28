import React from 'react'
import PropTypes from 'prop-types'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'

export default function EventsAventriAttendee({ activity: attendee }) {
  const attendeeFullName = `${attendee.object['dit:aventri:firstname']} ${attendee.object['dit:aventri:lastname']}`

  return (
    <ActivityCardWrapper dataTest="aventri-attendee">
      <ActivityCardSubject dataTest="aventri-attendee-name">
        {attendeeFullName}
      </ActivityCardSubject>
    </ActivityCardWrapper>
  )
}

EventsAventriAttendee.propTypes = {
  attendee: PropTypes.object.isRequired,
}
