import React from 'react'
import { connect } from 'react-redux'
import { ACTIVITY_STREAM_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'

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

import {
  LABELS,
  COLLECTION_LIST_SORT_SELECT_OPTIONS,
  AVENTRI_ID_MAX_LENGTH,
} from './constants'

import {
  ID,
  TASK_GET_EVENTS_LIST,
  TASK_GET_EVENTS_METADATA,
  TASK_GET_EVENTS_ORGANISER_NAME,
  TASK_GET_ALL_ACTIVITY_FEED_EVENTS,
  state2props,
} from './state'

import ActivityFeedFilteredCollectionList from '../../../components/ActivityFeedFilteredCollectionList'
import { sanitizeFilter } from '../../../../client/filters'

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

  const maxLengthAventriIdValidation = (e) => {
    if (e.target.value.length > AVENTRI_ID_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, AVENTRI_ID_MAX_LENGTH)
    }
  }

  return (
    <DefaultLayout heading="Events" pageTitle="Events">
      <CheckUserFeatureFlag userFeatureFlagName={ACTIVITY_STREAM_FEATURE_FLAG}>
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
              sanitizeFiltersForAnalytics={({ name, organisers }) => ({
                ...sanitizeFilter(name),
                ...sanitizeFilter(organisers),
              })}
            >
              <CollectionFilters taskProps={collectionListMetadataTask}>
                <Filters.Input
                  id="EventsCollection.name"
                  qsParam="name"
                  name="name"
                  label={LABELS.eventName}
                  placeholder="Search event name"
                  data-test="event-name-filter"
                />
                <FilterToggleSection
                  id="EventCollection.date"
                  label="Dates"
                  isOpen={true}
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
                    placeholder="Search organiser"
                    noOptionsMessage="No organisers found"
                    selectedOptions={selectedFilters.organisers.options}
                    data-test="organiser-filter"
                  />
                </FilterToggleSection>
                <FilterToggleSection
                  id="EventCollection.event-details-filters"
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
                  id="EventCollection.event-aventri-events"
                  label="Aventri events"
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
            </FilteredCollectionList>
          ) : (
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
                  placeholder="Search event name"
                  data-test="event-name-filter"
                />
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
              </CollectionFilters>
            </ActivityFeedFilteredCollectionList>
          )
        }
      </CheckUserFeatureFlag>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventsCollection)
