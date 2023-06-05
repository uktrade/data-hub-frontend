import React from 'react'
import { connect } from 'react-redux'

import {
  EVENTS__ALL_ACTIVITY_FEED_EVENTS_LOADED,
  EVENTS__METADATA_LOADED,
  EVENTS__SELECTED_ORGANISER,
} from '../../../actions'
import {
  CollectionFilters,
  Filters,
  FilterToggleSection,
  DefaultLayout,
} from '../../../components'

import {
  CheckboxPlaceholder,
  InputPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  LABELS,
  COLLECTION_LIST_SORT_SELECT_OPTIONS,
  AVENTRI_ID_MAX_LENGTH,
} from './constants'

import {
  ID,
  TASK_GET_EVENTS_METADATA,
  TASK_GET_EVENTS_ORGANISER_NAME,
  TASK_GET_ALL_ACTIVITY_FEED_EVENTS,
  state2props,
} from './state'

import ActivityFeedFilteredCollectionList from '../../../components/ActivityFeedFilteredCollectionList'

const EventsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  allActivityFeedEvents,
  total,
  page,
  ...props
}) => {
  const collectionListMetadataTask = {
    name: TASK_GET_EVENTS_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <ToggleHeadingPlaceholder />
        <InputPlaceholder count={4} />
        <CheckboxPlaceholder count={8} />
        <ToggleHeadingPlaceholder />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: EVENTS__METADATA_LOADED,
    },
  }

  const organisersTask = {
    name: TASK_GET_EVENTS_ORGANISER_NAME,
    id: ID,
    startOnRender: {
      payload: payload.organiser,
      onSuccessDispatch: EVENTS__SELECTED_ORGANISER,
    },
  }

  const activityFeedEventTask = {
    name: TASK_GET_ALL_ACTIVITY_FEED_EVENTS,
    id: ID,
    progressMessage: 'Loading events',
    startOnRender: {
      payload: payload,
      onSuccessDispatch: EVENTS__ALL_ACTIVITY_FEED_EVENTS_LOADED,
    },
  }

  const maxLengthAventriIdValidation = (e) => {
    if (e.target.value.length > AVENTRI_ID_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, AVENTRI_ID_MAX_LENGTH)
    }
  }

  return (
    <DefaultLayout heading="Events" pageTitle="Events">
      <ActivityFeedFilteredCollectionList
        {...props}
        collectionName="event"
        sortOptions={COLLECTION_LIST_SORT_SELECT_OPTIONS}
        taskProps={activityFeedEventTask}
        allActivityFeedEvents={allActivityFeedEvents}
        total={total}
        addItemURL={'/events/create'}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          <Filters.Input
            id="EventsCollection.name"
            qsParam="name"
            name="name"
            label={LABELS.eventName}
            data-test="event-name-filter"
          />
          <FilterToggleSection
            id="EventCollection.dates"
            label="Dates"
            isOpen={false}
          >
            <Filters.Date
              label={LABELS.earliestStartDate}
              name="earliest_start_date"
              qsParamName="earliest_start_date"
              data-test="earliest-start-date-filter"
            />
            <Filters.Date
              label={LABELS.latestStartDate}
              name="latest_start_date"
              qsParamName="latest_start_date"
              data-test="latest-start-date-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="EventCollection.organiser"
            label="Organisers"
            isOpen={false}
          >
            <Filters.AdvisersTypeahead
              isMulti={true}
              taskProps={organisersTask}
              label={LABELS.organiser}
              name="organiser"
              qsParam="organiser"
              placeholder=""
              noOptionsMessage="No organisers found"
              selectedOptions={selectedFilters.organisers.options}
              data-test="organiser-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="EventCollection.location"
            label="Location"
            isOpen={false}
          >
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.country}
              name="address_country"
              qsParam="address_country"
              placeholder="Search country"
              options={optionMetadata.countryOptions}
              selectedOptions={selectedFilters.countries.options}
              data-test="country-filter"
              labelAsQueryParam={true}
            />
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.ukRegion}
              name="uk_region"
              qsParam="uk_region"
              placeholder="Search UK region"
              options={optionMetadata.ukRegionOptions}
              selectedOptions={selectedFilters.ukRegions.options}
              data-test="uk-region-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="EventCollection.type-of-event"
            label="Type of event"
            isOpen={false}
          >
            <Filters.CheckboxGroup
              maxScrollHeight={200}
              legend={LABELS.eventType}
              name="event_type"
              qsParam="event_type"
              options={optionMetadata.eventTypeOptions}
              selectedOptions={selectedFilters.eventTypes.options}
              data-test="event-type-filter"
              groupId="event-type-filter"
            />
            <Filters.CheckboxGroup
              maxScrollHeight={200}
              legend={LABELS.relatedProgrammes}
              name="related_programmes"
              qsParam="related_programmes"
              options={optionMetadata.relatedProgrammeOptions}
              selectedOptions={selectedFilters.relatedProgrammes.options}
              data-test="related-programme-filter"
              groupId="related-programme-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="EventCollection.aventri"
            label="Aventri"
            isOpen={false}
          >
            <Filters.AventriId
              id="EventsCollection.aventriId"
              label={LABELS.aventriId}
              name="aventri_id"
              qsParam="aventri_id"
              hintText="For example, 100100100"
              type="number"
              onInput={maxLengthAventriIdValidation}
              data-test="aventri-id-filter"
            />
          </FilterToggleSection>
        </CollectionFilters>
      </ActivityFeedFilteredCollectionList>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventsCollection)
