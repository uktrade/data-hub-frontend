import React from 'react'
import { isEmpty } from 'lodash'
import { useParams, Link as RouterLink, Routes, Route } from 'react-router-dom'

import Button from '@govuk-react/button'
import styled from 'styled-components'

import { H3, Link } from 'govuk-react'

import urls from '../../../../lib/urls'
import {
  SummaryTable,
  FormActions,
  DefaultLayout,
  SecondaryButton,
  Form,
} from '../../../components'
import CollectionItem from '../../../components/CollectionList/CollectionItem'
import State from '../../../components/State'

import { VerticalTabNav } from '../../../components/TabNav'
import InteractionsV3 from '../../../components/Resource/InteractionsV3'
import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import StatusMessage from '../../../components/StatusMessage'
import { RED } from '../../../utils/colours'
import Interaction from '../../../components/Resource/Interaction'
import Event from '../../../components/Resource/Event'

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

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const Attendees = ({ eventId, isDisabled }) => (
  <div>
    <H3 as="h2">Event Attendees</H3>
    {isDisabled && (
      <StatusMessage>
        You cannot add an event attendee because the event has been disabled.
      </StatusMessage>
    )}
    <InteractionsV3.Paginated
      id="event-attendees"
      heading="attendee"
      addItemUrl={!isDisabled && `/events/${eventId}/attendees/find-new`}
      sortOptions={ATTENDEE_SORT_OPTIONS}
      payload={{
        event_id: eventId,
        // TODO: Once the API supports it, we need to add a filter to the payload,
        // which makes the API only return interactions/attendees which were not archived (deleted).

        // archived: false,
      }}
    >
      {(page) => (
        <ul>
          {page.map(
            ({
              id,
              archived,
              contacts: [contact],
              companies: [company],
              date,
              service,
            }) => (
              <CollectionItem
                headingText={contact?.name || 'Not available'}
                headingUrl={contact && `/contacts/${contact?.id}`}
                buttons={
                  <SecondaryButton as={RouterLink} to={`remove/${id}`}>
                    Delete
                  </SecondaryButton>
                }
                // TODO: Remove this when we can only fetch non-archived attendees.
                // This is here only for the sake of development, to see that an
                // attendee has been in deed archived by hitting the delete button.
                tags={archived && [{ text: 'Archived' }]}
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

const Details = ({
  eventType,
  eventDays,
  startDate,
  endDate,
  locationType,
  fullAddress,
  ukRegion,
  notes,
  leadTeam,
  organiser,
  otherTeams,
  relatedProgrammes,
  relatedTradeAgreements,
  disabledOn,
  service,
  id,
}) => (
  <>
    <StyledSummaryTable>
      <SummaryTable.Row heading="Type of event" children={eventType} />
      <SummaryTable.Row
        heading={eventDays == 1 ? 'Event date' : 'Event start date'}
        children={startDate}
      />
      {eventDays > 1 ? (
        <SummaryTable.Row heading="Event end date" children={endDate} />
      ) : null}
      <SummaryTable.Row heading="Event location type">
        {isEmpty(locationType) ? 'Not set' : locationType}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Address">{fullAddress}</SummaryTable.Row>
      <SummaryTable.Row heading="Region" hideWhenEmpty={false}>
        {isEmpty(ukRegion) ? 'Not set' : ukRegion}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Notes" hideWhenEmpty={false}>
        {isEmpty(notes) ? 'Not set' : notes}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Lead team">
        {isEmpty(leadTeam) ? 'Not set' : leadTeam}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Organiser">
        {isEmpty(organiser) ? 'Not set' : organiser}
      </SummaryTable.Row>
      <SummaryTable.ListRow
        heading="Other teams"
        value={otherTeams}
        emptyValue="Not set"
        hideWhenEmpty={false}
      />
      <SummaryTable.ListRow
        heading="Related programmes"
        value={relatedProgrammes}
        emptyValue="Not set"
        hideWhenEmpty={false}
      />
      <SummaryTable.ListRow
        heading="Related Trade Agreements"
        value={relatedTradeAgreements}
        emptyValue="Not set"
        hideWhenEmpty={false}
      />
      <SummaryTable.Row heading="Service" children={service} />
    </StyledSummaryTable>
    {!disabledOn && (
      <FormActions>
        <Button as={'a'} href={urls.events.edit(id)}>
          Edit event
        </Button>
      </FormActions>
    )}
  </>
)

const ConfirmRemove = () => {
  const { interactionId } = useParams()

  return (
    <>
      <Interaction id={interactionId}>
        {(interaction) => {
          const attendeeName = interaction.contacts?.[0].name
          return (
            <Form
              id="remove-event-attendee-confirmation"
              submissionTaskName="remove attendee"
              submitButtonLabel="Delete"
              cancelButtonLabel="Return without deleting"
              submitButtonColour={RED}
              // This tells the form to use React-Router SPA navigation
              // instead of hard-loading the next page,
              // which results in a much smoother UX experience and
              // is what we ultimately want to achieve.
              // Alas, the flash messages don't work with SPA navigation.
              // A quick fix is to force the form to reload the page with `redirectMode="hard"`.
              // Unfortunately, this also applies to the Cancel link of the form.
              redirectMode="soft"
              cancelRedirectTo={() => '../attendees'}
              redirectTo={() => '../attendees'}
              transformPayload={() => interactionId}
              flashMessage={() => [
                `You have removed ${attendeeName} from the event`,
                'The associate service delivery has been canceled.',
                'success',
              ]}
            >
              <p>
                Do you really want to remove the attendee {attendeeName} from
                the event?
              </p>
            </Form>
          )
        }}
      </Interaction>
    </>
  )
}

const EventDetails = ({ ...props }) => {
  const { id, ['*']: path } = useParams()
  const isDeleteAttendee = path.startsWith('attendees/remove/')

  return (
    <Event id={id}>
      {(event) => (
        <State>
          {({ flashMessages }) => (
            <DefaultLayout
              heading={event.name}
              pageTitle="Events"
              flashMessages={{
                ...flashMessages,
                info: [
                  ...(flashMessages.info || []),
                  ...(props.disabledOn
                    ? [
                        `This event was disabled on ${formatDate(props.disabledOn, DATE_FORMAT_FULL)} and can no longer be edited.`,
                      ]
                    : []),
                ],
              }}
              breadcrumbs={[
                {
                  link: urls.dashboard.index(),
                  text: 'Home',
                },
                {
                  link: urls.events.index(),
                  text: 'Events',
                },
                {
                  text: event.name,
                  link: urls.events.details(id),
                },
                ...(isDeleteAttendee
                  ? [
                      {
                        text: 'Attendees',
                        link: isDeleteAttendee && urls.events.attendees(id),
                      },
                      {
                        text: 'Delete',
                      },
                    ]
                  : [
                      {
                        text: { details: 'Details', attendees: 'Attendees' }[
                          path
                        ],
                      },
                    ]),
              ]}
              useReactRouter={true}
            >
              <Routes>
                <Route
                  path="attendees/remove/:interactionId"
                  element={<ConfirmRemove />}
                />
                <Route
                  path="*"
                  element={
                    <VerticalTabNav
                      routed={true}
                      id="event-details-tab-nav"
                      label="Event tab navigation"
                      selectedIndex="attendees"
                      tabs={{
                        [`/events/${id}/details`]: {
                          label: 'Details',
                          content: <Details {...props} />,
                        },
                        [`/events/${id}/attendees`]: {
                          label: 'Attendees',
                          content: (
                            <Attendees
                              eventId={id}
                              isDisabled={props.disabledOn}
                            />
                          ),
                        },
                      }}
                    />
                  }
                />
              </Routes>
            </DefaultLayout>
          )}
        </State>
      )}
    </Event>
  )
}

export default EventDetails
