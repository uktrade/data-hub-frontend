import React from 'react'
import { compact, isEmpty } from 'lodash'
import { H3, Link } from 'govuk-react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import urls from '../../../../lib/urls'
import CollectionItem from '../../../components/CollectionList/CollectionItem'
import { DefaultLayout, NewWindowLink, SummaryTable } from '../../../components'
import InteractionsV3 from '../../../components/Resource/InteractionsV3'
import { VerticalTabNav } from '../../../components/TabNav'
import { formatStartAndEndDate } from '../../../components/ActivityFeed/activities/date'
import { StovaEventResource } from '../../../components/Resource'
import StatusMessage from '../../../components/StatusMessage'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const ATTENDEE_SORT_OPTIONS = [
  { name: 'Last name: A-Z', value: 'last_name_of_first_contact' },
  { name: 'Last name: Z-A', value: '-last_name_of_first_contact' },
  { name: 'First name: A-Z', value: 'first_name_of_first_contact' },
  { name: 'First name: Z-A', value: '-first_name_of_first_contact' },
  { name: 'Company name: A-Z', value: 'company__name' },
  { name: 'Company name: Z-A', value: '-company__name' },
  { name: 'Recently added', value: '-created_on' },
  { name: 'Least recently added', value: 'created_on' },
]

const Attendees = ({ datahubEventId, stovaLink }) => (
  <div>
    <H3 as="h2">Stova Event Attendees</H3>
    <StatusMessage>
      Attendees must be added via Stova. <br />
      <NewWindowLink href={stovaLink}>View Event in Stova</NewWindowLink>
    </StatusMessage>
    <InteractionsV3.Paginated
      id="???"
      heading="attendee"
      sortOptions={ATTENDEE_SORT_OPTIONS}
      payload={{
        event_id: datahubEventId,
      }}
    >
      {(page) => (
        <ul>
          {page.map(
            ({ contacts: [contact], companies: [company], date, service }) => (
              <CollectionItem
                headingText={contact?.name || 'Not available'}
                headingUrl={contact && `/contacts/${contact?.id}`}
                metadata={[
                  {
                    label: 'Company',
                    value: (
                      <Link href={`/companies/${company?.id}`}>
                        {company?.name}
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
            )
          )}
        </ul>
      )}
    </InteractionsV3.Paginated>
  </div>
)

const EventDetails = ({ stovaEvent, stovaLink }) => {
  return (
    <>
      <H3 as="h2">Stova Event Details</H3>
      <StatusMessage>
        <div>This event has been automatically synced from Stova.</div>
        <div>
          Event details, registrants and attendees can only be edited in Stova.
          Changes can take up to 24 hours to sync.
        </div>
        <NewWindowLink href={stovaLink}>View Event in Stova</NewWindowLink>
      </StatusMessage>
      <StyledSummaryTable>
        <SummaryTable.Row heading="Name" children={stovaEvent.name} />
        <SummaryTable.Row
          heading="Event date"
          children={formatStartAndEndDate(
            stovaEvent.startDate,
            stovaEvent.endDate
          )}
        />
        <SummaryTable.Row
          heading="Event location type"
          children={
            isEmpty(stovaEvent.locationName)
              ? 'Not set'
              : stovaEvent.locationName
          }
        />
        <SummaryTable.Row
          heading="Location Address"
          children={
            isEmpty(
              compact([
                stovaEvent.locationAddress1,
                stovaEvent.locationAddress2,
                stovaEvent.locationAddress3,
                stovaEvent.locationCity,
                stovaEvent.locationPostcode,
                stovaEvent.locationState,
                stovaEvent.locationCountry,
              ])
            )
              ? 'Not set'
              : compact([
                  stovaEvent.locationAddress1,
                  stovaEvent.locationAddress2,
                  stovaEvent.locationAddress3,
                  stovaEvent.locationCity,
                  stovaEvent.locationPostcode,
                  stovaEvent.locationState,
                  stovaEvent.locationCountry,
                ])
          }
        />
        <SummaryTable.Row
          heading="Stova reference number"
          children={
            <>
              <span>
                {stovaEvent.stovaEventId}&nbsp;
                <NewWindowLink href={stovaLink}>View in Stova</NewWindowLink>
              </span>
            </>
          }
        />
        <SummaryTable.Row
          heading="Approval Required"
          children={
            isEmpty(stovaEvent.approvalRequired)
              ? 'Not set'
              : stovaEvent.approvalRequired
          }
        />
        <SummaryTable.Row
          heading="Close Date"
          children={
            isEmpty(stovaEvent.closeDate) ? 'Not set' : stovaEvent.closeDate
          }
        />
        <SummaryTable.Row
          heading="Code"
          children={isEmpty(stovaEvent.code) ? 'Not set' : stovaEvent.code}
        />
        <SummaryTable.Row
          heading="Contact Info"
          children={
            isEmpty(stovaEvent.contactInfo) ? 'Not set' : stovaEvent.contactInfo
          }
        />
        <SummaryTable.Row
          heading="Default Language"
          children={
            isEmpty(stovaEvent.defaultLanguage)
              ? 'Not set'
              : stovaEvent.defaultLanguage
          }
        />
        <SummaryTable.Row
          heading="Description"
          children={
            isEmpty(stovaEvent.description) ? 'Not set' : stovaEvent.description
          }
        />
        <SummaryTable.Row
          heading="Price Type"
          children={
            isEmpty(stovaEvent.priceType) ? 'Not set' : stovaEvent.priceType
          }
        />
        <SummaryTable.Row
          heading="Standard Currency"
          children={
            isEmpty(stovaEvent.standardCurrency)
              ? 'Not set'
              : stovaEvent.standardCurrency
          }
        />
        <SummaryTable.Row
          heading="Live Date"
          children={
            isEmpty(stovaEvent.liveDate) ? 'Not set' : stovaEvent.liveDate
          }
        />
        <SummaryTable.Row
          heading="Folder ID"
          children={
            isEmpty(stovaEvent.folderId) ? 'Not set' : stovaEvent.folderId
          }
        />
        <SummaryTable.Row
          heading="Max Reg"
          children={isEmpty(stovaEvent.maxReg) ? 'Not set' : stovaEvent.maxReg}
        />
        <SummaryTable.Row
          heading="Address"
          children={
            isEmpty(
              compact([stovaEvent.city, stovaEvent.country, stovaEvent.state])
            )
              ? 'Not set'
              : compact([stovaEvent.city, stovaEvent.country, stovaEvent.state])
          }
        />
        <SummaryTable.Row
          heading="Timezone"
          children={
            isEmpty(stovaEvent.timezone) ? 'Not set' : stovaEvent.timezone
          }
        />
        <SummaryTable.Row
          heading="Created By"
          children={
            isEmpty(stovaEvent.createdBy) ? 'Not set' : stovaEvent.createdBy
          }
        />
        <SummaryTable.Row
          heading="Created Date"
          children={
            isEmpty(stovaEvent.createdDate) ? 'Not set' : stovaEvent.createdDate
          }
        />
        <SummaryTable.Row
          heading="Modified By"
          children={
            isEmpty(stovaEvent.modifiedBy) ? 'Not set' : stovaEvent.modifiedBy
          }
        />
        <SummaryTable.Row
          heading="Modified Date"
          children={
            isEmpty(stovaEvent.modifiedDate)
              ? 'Not set'
              : stovaEvent.modifiedDate
          }
        />
      </StyledSummaryTable>
    </>
  )
}

const StovaEventDetails = ({ name }) => {
  const { stovaEventId } = useParams()

  return (
    <StovaEventResource id={stovaEventId}>
      {(stovaEvent) => {
        const stovaLink = `https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=${stovaEvent.stovaEventId}`
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
        ]
        return (
          <DefaultLayout
            heading={name}
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
                [urls.events.stova.details(stovaEventId)]: {
                  label: 'Details',
                  content: (
                    <EventDetails
                      stovaEvent={stovaEvent}
                      stovaLink={stovaLink}
                    />
                  ),
                },
                [urls.events.stova.attendees(stovaEventId)]: {
                  label: 'Attendees',
                  content: (
                    <Attendees
                      datahubEventId={stovaEvent.datahubEvent[0]}
                      stovaLink={stovaLink}
                    />
                  ),
                },
              }}
            />
          </DefaultLayout>
        )
      }}
    </StovaEventResource>
  )
}

export default StovaEventDetails
