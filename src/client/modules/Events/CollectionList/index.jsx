import React from 'react'
import { connect } from 'react-redux'
import { Link, H4 } from 'govuk-react'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import {
  EVENTS__LOADED,
  EVENTS__METADATA_LOADED,
  EVENTS__SELECTED_ORGANISER,
} from '../../../actions'
import {
  CollectionFilters,
  CollectionItem,
  Filters,
  FilterToggleSection,
  FilteredCollectionList,
  DefaultLayout,
} from '../../../components'

import {
  CheckboxPlaceholder,
  InputPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import { LABELS, COLLECTION_LIST_SORT_SELECT_OPTIONS } from './constants'

import {
  ID,
  TASK_GET_EVENTS_METADATA,
  TASK_GET_EVENTS_ORGANISER_NAME,
  TASK_GET_EVENTS_LIST,
  state2props,
} from './state'

import { BLUE, GREY_2 } from '../../../utils/colours'

export const StyledCollectionItem = styled(CollectionItem)`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

const StyledLinkHeader = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: ${({ margin }) => `${margin.top}px`};
  margin-bottom: ${({ margin }) => `${margin.bottom}px`};
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

// FIXME: This should be a component
// e.g. the positional arguments should be passed as an object
export const TitleRenderer = (title, url, margin = { bottom: 10 }) => (
  <StyledLinkHeader margin={margin}>
    {url ? <Link href={url}>{title}</Link> : <H4>{title}</H4>}
  </StyledLinkHeader>
)

const EventTemplate = (item) => {
  return (
    <StyledCollectionItem
      dataTest="data-hub-event"
      headingText={item.headingText}
      headingUrl={`/events/${item.id}/details`}
      metadata={item.metadata}
      tags={item.tags}
      titleRenderer={TitleRenderer}
      showTagsInMetadata={true}
    />
  )
}

const EventsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
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

  const collectionListTask = {
    name: TASK_GET_EVENTS_LIST,
    id: ID,
    progressMessage: 'Loading events',
    startOnRender: {
      payload: payload,
      onSuccessDispatch: EVENTS__LOADED,
    },
  }

  //TODO - Restore this once the event DAG is in place
  /*const maxLengthAventriIdValidation = (e) => {
    if (e.target.value.length > AVENTRI_ID_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, AVENTRI_ID_MAX_LENGTH)
    }
  }*/

  return (
    <DefaultLayout heading="Events" pageTitle="Events">
      <FilteredCollectionList
        {...props}
        collectionName="event"
        sortOptions={COLLECTION_LIST_SORT_SELECT_OPTIONS}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        total={total}
        addItemUrl={'/events/create'}
        collectionItemTemplate={EventTemplate}
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
              qsParamName="start_date_after"
              data-test="earliest-start-date-filter"
            />
            <Filters.Date
              label={LABELS.latestStartDate}
              name="latest_start_date"
              qsParamName="start_date_before"
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
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.eventType}
              name="event_type"
              qsParam="event_type"
              placeholder="Search event type"
              options={optionMetadata.eventTypeOptions}
              selectedOptions={selectedFilters.eventTypes.options}
              data-test="event-type-filter"
              groupId="event-type-filter"
            />
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.relatedProgrammes}
              name="related_programmes"
              qsParam="related_programmes"
              placeholder="Search related programmes"
              options={optionMetadata.relatedProgrammeOptions}
              selectedOptions={selectedFilters.relatedProgrammes.options}
              data-test="related-programme-filter"
              groupId="related-programme-filter"
            />
          </FilterToggleSection>
          {/* TODO - restore this filter once the event DAG is in place */}
          {/*<FilterToggleSection
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
          </FilterToggleSection>*/}
        </CollectionFilters>
      </FilteredCollectionList>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventsCollection)
