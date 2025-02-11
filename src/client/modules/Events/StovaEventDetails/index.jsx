import React from 'react'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout, NewWindowLink } from '../../../components'
import { VerticalTabNav } from '../../../components/TabNav'
import { StovaEventResource } from '../../../components/Resource'
import { Attendees } from './Attendees'
import { EventDetails } from './EventDetails'
import StatusMessage from '../../../../client/components/StatusMessage'

const StovaEventDetails = () => {
  const { stovaEventId, ['*']: path } = useParams()

  return (
    <StovaEventResource id={stovaEventId}>
      {(stovaEvent) => (
        <StovaEventDetailsPage stovaEvent={stovaEvent} path={path} />
      )}
    </StovaEventResource>
  )
}

const StovaEventDetailsPage = ({ stovaEvent, path }) => {
  const breadcrumbs = [
    {
      link: urls.dashboard.index(),
      text: 'Home',
    },
    {
      link: urls.events.index(),
      text: 'Events',
    },
    {
      text: stovaEvent.name,
    },
    {
      text: { details: 'Details', attendees: 'Attendees' }[path],
    },
  ]

  const eventMessage = (
    <StatusMessage>
      This event has been automatically synced from Stova. Event details and
      attendees can only be edited in Stova.
      <br />
      <NewWindowLink href={urls.external.stova(stovaEvent.stovaEventId)}>
        View Event in Stova
      </NewWindowLink>
    </StatusMessage>
  )

  return (
    <DefaultLayout
      heading={stovaEvent.name}
      pageTitle="Events"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <VerticalTabNav
        routed={true}
        id="stova-event-details-tab-nav"
        label="Event tab navigation"
        selectedIndex="attendees"
        tabs={{
          [urls.events.stova.details(stovaEvent.id)]: {
            label: 'Details',
            content: (
              <>
                {eventMessage}
                <EventDetails stovaEvent={stovaEvent} />
              </>
            ),
          },
          [urls.events.stova.attendees(stovaEvent.id)]: {
            label: 'Attendees',
            content: (
              <>
                {eventMessage}
                <Attendees datahubEventId={stovaEvent.datahubEvent[0]} />
              </>
            ),
          },
        }}
      />
    </DefaultLayout>
  )
}

export { StovaEventDetails, StovaEventDetailsPage }
