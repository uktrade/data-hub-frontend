import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'

import CardUtils from './card/CardUtils'

import { formatStartAndEndDate } from './date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'
import { getServiceOtherText, getServiceText } from './InteractionUtils'
import OverviewActivityCardWrapper from './card/OverviewActivityCardWrapper'

// Event index to extract unique uuid from DataHubEvent id string feed by activity-stream
// e.g. dit:DataHubEvent:b93d4274-36fe-4008-ac40-fbc197916666:Announce
const EVENT_ID_INDEX = 2
const NOT_SET = 'Not set'

export default class DataHubEvent extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender = (event) => {
    return CardUtils.canRenderByTypes(event, ACTIVITY_TYPE.DataHubEvent)
  }

  render() {
    const { activity, isOverview } = this.props
    const eventObject = activity.object
    const eventName = eventObject.name
    const eventId = eventObject.id.split(':')[EVENT_ID_INDEX]
    const date = formatStartAndEndDate(
      eventObject.startTime,
      eventObject.endTime
    )
    const organiser = eventObject['dit:organiser']?.name || NOT_SET
    const serviceType = eventObject['dit:service']?.name || NOT_SET
    const leadTeam = eventObject['dit:leadTeam']?.name || NOT_SET
    const typeOfEvent = eventObject['dit:eventType']?.name || undefined
    const [, service2] = serviceType.split(' : ')
    const serviceText = getServiceText(serviceType)
    const serviceOther = getServiceOtherText(service2)
    const subject = (
      <Link as={RouterLink} to={`/events/${eventId}/details`}>
        {eventName}
      </Link>
    )
    return isOverview ? (
      <OverviewActivityCardWrapper dataTest="data-hub-event-summary">
        <ActivityOverviewSummary
          date={date}
          kind={typeOfEvent}
          subject={subject}
          summary={`${organiser} organised ${serviceType}`}
        ></ActivityOverviewSummary>
      </OverviewActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="data-hub-event">
        <ActivityCardSubject dataTest="data-hub-event-name">
          {subject}
        </ActivityCardSubject>
        <ActivityCardLabels
          theme={serviceText}
          service={serviceOther}
          kind={typeOfEvent}
        />
        <ActivityCardMetadata
          metadata={[
            {
              label: 'Event date',
              value: date,
            },
            {
              label: 'Organiser',
              value: organiser,
            },
            {
              label: 'Service type',
              value: serviceType,
            },
            {
              label: 'Lead team',
              value: leadTeam,
            },
          ]}
        />
      </ActivityCardWrapper>
    )
  }
}
