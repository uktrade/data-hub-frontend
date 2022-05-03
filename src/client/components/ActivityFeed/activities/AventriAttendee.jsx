import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { Card, CardHeader } from './card'
import { GREEN } from 'govuk-colours'

const transformAventriAttendee = (activity) => {
  return {
    event: { name: 'event name TBC' },
    startTime: 'TBC',
    company: { name: activity.object['dit:aventri:companyname'] },
    registrationStatus: activity.object['dit:aventri:registrationstatus'],
  }
}
export default function AventriAttendee({ activity }) {
  const { event, company, registrationStatus, startTime } =
    transformAventriAttendee(activity)

  return (
    <div data-test={'aventri-activity'}>
      <Card>
        <CardHeader
          badge={{ borderColour: GREEN, text: 'Aventri Service Delivery' }}
          company={company}
          heading={`Attended event ${event.name}`}
        />
        <p>Registration Status: {registrationStatus || 'Unknown'} </p>
        <p>Start Time: {startTime || 'Unknown'}</p>
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
