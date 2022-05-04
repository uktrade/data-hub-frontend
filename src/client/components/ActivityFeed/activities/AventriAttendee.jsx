import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { Card, CardHeader } from './card'
import { GREEN } from 'govuk-colours'
import { format } from '../../../utils/date'

const transformAventriAttendee = (activity) => {
  return {
    eventName: activity.eventName,
    startDate: format(activity.startDate),
  }
}
export default function AventriAttendee({ activity }) {
  const { eventName, startDate } = transformAventriAttendee(activity)

  return (
    <div data-test={'aventri-activity'}>
      <Card>
        <CardHeader
          badge={{ borderColour: GREEN, text: 'Aventri Service Delivery' }}
          heading={eventName}
        />
        <p>Date: {startDate || 'Unknown'}</p>
      </Card>
    </div>
  )
}

AventriAttendee.propTypes = {
  activity: PropTypes.object.isRequired,
}

AventriAttendee.canRender = (activity) => {
  return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.AventriAttendee)
}
