import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

import Button from '@govuk-react/button'
import styled from 'styled-components'

import { H3, Link } from 'govuk-react'

import urls from '../../../../lib/urls'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import { SummaryTable, FormActions, DefaultLayout } from '../../../components'
import CollectionItem from '../../../components/CollectionList/CollectionItem'
import State from '../../../components/State'

import { VerticalTabNav } from '../../../components/TabNav'
import InteractionsV3 from '../../../components/Resource/InteractionsV3'
import { formatMediumDate } from '../../../utils/date'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const Attendees = ({ eventId }) => (
  <div>
    <H3 as="h2">Event Attendees</H3>
    <InteractionsV3.Paginated
      id="???"
      heading="attendee"
      addItemUrl={`/events/${eventId}/attendees/find-new`}
      sortOptions={[
        { name: 'Last name: A-Z', value: 'last_name_of_first_contact' },
        { name: 'Last name: Z-A', value: '-last_name_of_first_contact' },
        { name: 'First name: A-Z', value: 'first_name_of_first_contact' },
        { name: 'First name: Z-A', value: '-first_name_of_first_contact' },
        { name: 'Company name: A-Z', value: 'company__name' },
        { name: 'Company name: Z-A', value: '-company__name' },
        { name: 'Recently added', value: '-created_on' },
        { name: 'Least recently added', value: 'created_on' },
      ]}
      payload={{
        event_id: eventId,
      }}
    >
      {(page) => (
        <ul>
          {page.map((interaction) => (
            <CollectionItem
              headingText={interaction.contact.name}
              headingUrl={`/contacts/${interaction.contact.id}`}
              metadata={[
                {
                  label: 'Company',
                  value: (
                    <Link href={`/companies/${interaction.companies[0].id}`}>
                      {interaction.companies[0].name}
                    </Link>
                  ),
                },
                ...(interaction.contact.job_title
                  ? [
                      {
                        label: 'Job title',
                        value: interaction.contact.job_title,
                      },
                    ]
                  : []),
                {
                  label: 'Date attended',
                  value: formatMediumDate(interaction.date),
                },
                {
                  label: 'Service delivery',
                  value: (
                    <Link href={`/companies/${interaction.service.id}`}>
                      {interaction.service.name}
                    </Link>
                  ),
                },
              ]}
            />
          ))}
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

const EventDetails = ({ name, ...props }) => {
  const { id, ['*']: path } = useParams()

  return (
    <State>
      {({ flashMessages }) => (
        <DefaultLayout
          heading={name}
          pageTitle="Events"
          flashMessages={flashMessages}
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
              text: name,
            },
            {
              text: { details: 'Details', attendees: 'Attendees' }[path],
            },
          ]}
          useReactRouter={true}
        >
          <Task.Status
            name={TASK_GET_EVENT_DETAILS}
            id={ID}
            progressMessage="loading event details"
            startOnRender={{
              payload: id,
              onSuccessDispatch: EVENTS__DETAILS_LOADED,
            }}
          >
            {() => (
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
                    label: 'Attendes',
                    content: <Attendees eventId={id} />,
                  },
                }}
              />
            )}
          </Task.Status>
        </DefaultLayout>
      )}
    </State>
  )
}

export default connect(state2props)(EventDetails)
