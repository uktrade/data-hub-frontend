import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import {
  FilteredCollectionList,
  CollectionFilters,
  Filters,
  Panel,
  DefaultLayout,
} from '../../../components'

import {
  listSkeletonPlaceholder,
  ToggleHeadingPlaceholder,
  InputPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  SEARCH_ATTENDEE_ID,
  state2props,
  TASK_SEARCH_ATTENDEE,
  TASK_GET_ATTENDEE_METADATA,
} from './state'

import {
  EVENTS__ATTENDEE_METADATA_LOADED,
  EVENTS__SEARCH_ATTENDEE_LIST_LOADED,
} from '../../../actions'
import { LABELS } from './constants'
import urls from '../../../../lib/urls'
import { EventResource } from '../../../components/Resource'

const StyledPanel = styled(Panel)`
  margin-bottom: ${SPACING.SCALE_3};
`

const AttendeeSearch = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const { eventId } = useParams()

  const collectionListTask = {
    name: TASK_SEARCH_ATTENDEE,
    id: SEARCH_ATTENDEE_ID,
    progressMessage: 'Loading contacts',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        eventId: eventId,
      },
      onSuccessDispatch: EVENTS__SEARCH_ATTENDEE_LIST_LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_ATTENDEE_METADATA,
    id: SEARCH_ATTENDEE_ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <ToggleHeadingPlaceholder />
        <InputPlaceholder count={5} />
        <ToggleHeadingPlaceholder />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: EVENTS__ATTENDEE_METADATA_LOADED,
    },
  }

  return (
    <EventResource id={eventId}>
      {(event) => (
        <>
          <DefaultLayout
            heading={event.name}
            pageTitle={`${event.name} - Events`}
            breadcrumbs={[
              { link: urls.dashboard.index(), text: 'Home' },
              {
                link: urls.events.index(),
                text: 'Events',
              },
              { link: urls.events.details(eventId), text: event.name },
              { text: 'Add attendee' },
            ]}
          >
            <StyledPanel data-test="help-panel">
              <p>
                Select the contact to show they attended the event. If you can't
                find the contact, you should check they have been added to the
                company record before returning to this event to record their
                attendance.
              </p>
            </StyledPanel>
            <FilteredCollectionList
              {...props}
              collectionName="contact"
              sortOptions={optionMetadata.sortOptions}
              taskProps={collectionListTask}
              selectedFilters={selectedFilters}
              entityName="attendee"
            >
              <CollectionFilters taskProps={collectionListMetadataTask}>
                <Filters.Input
                  id="AttendeeCollection.name"
                  qsParam="name"
                  name="name"
                  label={LABELS.contactName}
                  placeholder="Search contact name"
                  data-test="contact-name-filter"
                />
                <Filters.Input
                  id="AttendeeCollection.company-name"
                  qsParam="company_name"
                  name="company_name"
                  label={LABELS.companyName}
                  placeholder="Search company name"
                  data-test="company-name-filter"
                />
                <Filters.Input
                  id="AttendeeCollection.email"
                  qsParam="email"
                  name="email"
                  label={LABELS.email}
                  placeholder="Search email address"
                  data-test="email-address-filter"
                />
                <Filters.Typeahead
                  isMulti={true}
                  label={LABELS.country}
                  name="country"
                  qsParam="address_country"
                  placeholder="Search country"
                  options={optionMetadata.countryOptions}
                  selectedOptions={selectedFilters.addressCountries.options}
                  data-test="country-filter"
                />
                <Filters.Typeahead
                  isMulti={true}
                  label={LABELS.ukRegion}
                  name="uk_region"
                  qsParam="company_uk_region"
                  placeholder="Search UK region"
                  options={optionMetadata.ukRegionOptions}
                  selectedOptions={selectedFilters.companyUkRegions.options}
                  data-test="uk-region-filter"
                />
              </CollectionFilters>
            </FilteredCollectionList>
          </DefaultLayout>
        </>
      )}
    </EventResource>
  )
}

AttendeeSearch.propTypes = {
  payload: PropTypes.object.isRequired,
  optionMetadata: PropTypes.object.isRequired,
  selectedFilters: PropTypes.object.isRequired,
}

export default connect(state2props)(AttendeeSearch)
