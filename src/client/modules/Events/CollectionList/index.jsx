import React from 'react'
import { connect } from 'react-redux'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'

import {
  EVENTS__ALL_ACTIVITY_FEED_EVENTS_LOADED,
  EVENTS__LOADED,
  EVENTS__METADATA_LOADED,
  EVENTS__SELECTED_ORGANISER,
} from '../../../actions'
import {
  CollectionFilters,
  FilteredCollectionList,
  Filters,
  FilterToggleSection,
  DefaultLayout,
} from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'

import {
  listSkeletonPlaceholder,
  CheckboxPlaceholder,
  InputPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import { LABELS, COLLECTION_LIST_SORT_SELECT_OPTIONS } from './constants'

import {
  ID,
  TASK_GET_EVENTS_LIST,
  TASK_GET_EVENTS_METADATA,
  TASK_GET_EVENTS_ORGANISER_NAME,
  TASK_GET_ALL_ACTIVITY_FEED_EVENTS,
  state2props,
} from './state'

import EventsFilteredCollectionList from '../../../components/NewFilteredCollectionList'

const EventsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  allActivityFeedEvents,
  total,
  page,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_EVENTS_LIST,
    id: ID,
    progressMessage: 'Loading events',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: EVENTS__LOADED,
    },
  }

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

  return (
    <DefaultLayout heading="Events" pageTitle="Events">
      <CheckUserFeatureFlag userFeatureFlagName={EVENT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagOn) =>
          !isFeatureFlagOn ? (
            <FilteredCollectionList
              {...props}
              collectionName="event"
              sortOptions={optionMetadata.sortOptions}
              taskProps={collectionListTask}
              selectedFilters={selectedFilters}
              entityName="event"
              entityNamePlural="events"
              addItemUrl="/events/create"
              useReactRouter={true}
            >
              <CollectionFilters taskProps={collectionListMetadataTask}>
                <FilterToggleSection
                  id="EventCollection.event-details-filters"
                  label="Event details"
                  isOpen={true}
                >
                  <Filters.Input
                    id="EventsCollection.name"
                    qsParam="name"
                    name="name"
                    label={LABELS.eventName}
                    placeholder="Search event name"
                    data-test="event-name-filter"
                  />
                  <Filters.AdvisersTypeahead
                    isMulti={true}
                    taskProps={organisersTask}
                    label={LABELS.organiser}
                    name="organiser"
                    qsParam="organiser"
                    placeholder="Search organiser"
                    noOptionsMessage="No organisers found"
                    selectedOptions={selectedFilters.organisers.options}
                    data-test="organiser-filter"
                  />
                  <Filters.Date
                    label={LABELS.startDateAfter}
                    name="start_date_after"
                    qsParamName="start_date_after"
                    data-test="start-date-after-filter"
                  />
                  <Filters.Date
                    label={LABELS.startDateBefore}
                    name="start_date_before"
                    qsParamName="start_date_before"
                    data-test="start-date-before-filter"
                  />
                  <Filters.CheckboxGroup
                    maxScrollHeight={345}
                    legend={LABELS.eventType}
                    name="event_type"
                    qsParam="event_type"
                    options={optionMetadata.eventTypeOptions}
                    selectedOptions={selectedFilters.eventTypes.options}
                    data-test="event-type-filter"
                    groupId="event-type-filter"
                  />
                </FilterToggleSection>
                <FilterToggleSection
                  id="EventCollection.event-location-details-filters"
                  label="Event location details"
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
              </CollectionFilters>
            </FilteredCollectionList>
          ) : (
            <EventsFilteredCollectionList
              {...props}
              collectionName="event"
              sortOptions={COLLECTION_LIST_SORT_SELECT_OPTIONS}
              taskProps={activityFeedEventTask}
              allActivityFeedEvents={allActivityFeedEvents}
              total={total}
            >
              <CollectionFilters>
                <Filters.Input
                  id="EventsCollection.name"
                  qsParam="name"
                  name="name"
                  label={LABELS.eventName}
                  placeholder="Search event name"
                  data-test="event-name-filter"
                />
                <Filters.Date
                  label="Earliest start date"
                  name="earliest_start_date"
                  qsParamName="earliest_start_date"
                  data-test="earliest-start-date-filter"
                />
                <Filters.Date
                  label="Latest start date"
                  name="latest_start_date"
                  qsParamName="latest_start_date"
                  data-test="latest-start-date-filter"
                />
              </CollectionFilters>
            </EventsFilteredCollectionList>
          )
        }
      </CheckUserFeatureFlag>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventsCollection)
