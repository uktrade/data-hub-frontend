import React from 'react'
import { H3, Link } from 'govuk-react'

import { ATTENDEE_SORT_OPTIONS } from '../constants'
import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import CollectionItem from '../../../components/CollectionList/CollectionItem'
import InteractionsV3 from '../../../components/Resource/InteractionsV3'

// Attendees are contacts for an interaction linked to an event created via Stova.
const Attendees = ({ datahubEventId }) => (
  <div>
    <H3 as="h2">Stova Event Attendees</H3>
    <InteractionsV3.Paginated
      id="interaction-for-stova-event"
      heading="attendee"
      sortOptions={ATTENDEE_SORT_OPTIONS}
      payload={{
        event_id: datahubEventId,
      }}
    >
      {(interactions) => <AttendeeList interactions={interactions} />}
    </InteractionsV3.Paginated>
  </div>
)

const AttendeeList = ({ interactions }) => {
  return (
    <ul>
      {interactions.map(
        ({ contacts: [contact], companies: [company], date, service }) => (
          <div key={contact.id}>
            <CollectionItem
              headingText={contact?.name}
              headingUrl={contact && `/contacts/${contact?.id}`}
              metadata={[
                {
                  label: 'Company',
                  value: (
                    <Link href={`/companies/${company?.id}`}>
                      {company?.name || 'Not available'}
                    </Link>
                  ),
                },
                {
                  label: 'Job title',
                  value: contact?.job_title || 'Not available',
                },
                {
                  label: 'Date attended',
                  value: formatDate(date, DATE_FORMAT_FULL),
                },
                {
                  label: 'Service delivery',
                  value: (
                    <Link href={`/companies/${service.id}`}>
                      {service.name}
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        )
      )}
    </ul>
  )
}

export { Attendees, AttendeeList }
