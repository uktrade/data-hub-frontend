import React from 'react'
import { connect } from 'react-redux'

import {
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

import {
  listSkeletonPlaceholder,
  filterSkeletonPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import { LABELS } from './constants'

import {
  ID,
  TASK_GET_EVENTS_LIST,
  TASK_GET_EVENTS_METADATA,
  TASK_GET_EVENTS_ORGANISER_NAME,
  state2props,
} from './state'

const EventsCollection = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
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
    renderProgress: filterSkeletonPlaceholder({
      filterCheckboxCount: 0,
      filterInputFields: 6,
    }),
    startOnRender: {
      onSuccessDispatch: EVENTS__METADATA_LOADED,
    },
  }

  const organisersTask = {
    name: TASK_GET_EVENTS_ORGANISER_NAME,
    id: ID,
    progressMessage: 'Loading organisers',
    startOnRender: {
      payload: payload.organiser,
      onSuccessDispatch: EVENTS__SELECTED_ORGANISER,
    },
  }

  return (
    <DefaultLayout heading="Events" pageTitle="Events">
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
    </DefaultLayout>
  )
}

export default connect(state2props)(EventsCollection)
