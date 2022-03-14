import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { Card, CardHeader } from './card'
import { GREEN } from 'govuk-colours'

const transformAventriAttendee = (activity) => {
  return {
    event: { name: 'Event name tbc' },
    company: { name: activity.object['dit:aventri:companyname'] },
    registrationStatus: activity.object['dit:aventri:registrationstatus'],
  }
}

export default class AventriAttendee extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.AventriAttendee)
  }

  render() {
    const { activity } = this.props
    const { event, company, registrationStatus } =
      transformAventriAttendee(activity)

    return (
      <div data-test={'aventri'}>
        <Card>
          <CardHeader
            badge={{ borderColour: GREEN, text: 'Aventri Service Delivery' }}
            company={company}
            heading={`Attended event ${event.name}`}
          />
          <p>Registration Status: {registrationStatus || 'Unknown'} </p>
        </Card>
      </div>
    )
  }
}
