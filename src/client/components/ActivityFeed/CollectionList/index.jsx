import React from 'react'
import { connect } from 'react-redux'

import {
  COMPANY_ACTIVITIES__LOADED,
  COMPANY_ACTIVITIES_SELECTED_ADVISERS,
  COMPANY_ACTIVITIES__METADATA_LOADED,
} from '../../../actions'

import { LABELS } from './constants'

import {
  CollectionFilters,
  FilteredCollectionList,
  FilterToggleSection,
  Filters,
} from '../../../components'

import {
  listSkeletonPlaceholder,
  CheckboxPlaceholder,
  InputPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  ID,
  state2props,
  TASK_GET_COMPANY_ACTIVITIES_LIST,
  TASK_GET_COMPANY_ACTIVITIES_METADATA,
  TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME,
} from './state'

import { sanitizeFilter } from '../../../../client/filters'
import Activity from '../Activity'

const collectionItemTemplateDefault = (activity) => {
  return (
    <li key={activity.id}>
      <Activity {...activity} activity={activity} key={activity.id} />
    </li>
  )
}

const CompanyActivityCollection = ({
  payload,
  company,
  optionMetadata,
  selectedFilters,
  currentAdviserId,
  dnbHierarchyCount,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_COMPANY_ACTIVITIES_LIST,
    id: ID,
    progressMessage: 'Loading interactions',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        company: company,
      },
      onSuccessDispatch: COMPANY_ACTIVITIES__LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME,
    id: ID,
    startOnRender: {
      payload: payload.ditParticipantsAdviser,
      onSuccessDispatch: COMPANY_ACTIVITIES_SELECTED_ADVISERS,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_COMPANY_ACTIVITIES_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <CheckboxPlaceholder count={1} />
        <CheckboxPlaceholder count={2} />
        <ToggleHeadingPlaceholder />
        <InputPlaceholder count={5} />
        <CheckboxPlaceholder count={1} />
        <CheckboxPlaceholder count={7} />
        <ToggleHeadingPlaceholder count={2} />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: COMPANY_ACTIVITIES__METADATA_LOADED,
    },
  }

  const myInteractionsSelected = selectedFilters.advisers.options
    .map(({ value }) => value)
    .includes(currentAdviserId)

  const myInteractionsOption = {
    label: LABELS.myInteractions,
    value: currentAdviserId,
  }

  const dnbHierarchyCountOption = {
    label: `Activity across all ${dnbHierarchyCount} companies`,
    value: true,
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="activities"
      // sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      entityName="companyActivities"
      sanitizeFiltersForAnalytics={({ advisers, teams }) => ({
        ...sanitizeFilter(advisers),
        ...sanitizeFilter(teams),
      })}
      collectionItemTemplate={collectionItemTemplateDefault}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <Filters.CheckboxGroup
          legend={LABELS.myInteractions}
          name="my_interactions"
          qsParam="ditParticipantsAdviser"
          options={[myInteractionsOption]}
          selectedOptions={myInteractionsSelected ? [myInteractionsOption] : []}
          data-test="my-interactions-filter"
        />
        {dnbHierarchyCount > 0 && (
          <Filters.CheckboxGroup
            legend={LABELS.showDNBHierarchy}
            name="show_dnb_hierarchy"
            qsParam="show_dnb_hierarchy"
            options={[dnbHierarchyCountOption]}
            selectedOptions={
              payload.show_dnb_hierarchy ? [dnbHierarchyCountOption] : []
            }
            data-test="show-dnb-hierarchy-filter"
          />
        )}
        <FilterToggleSection
          id="CompanyActivityCollection.interaction-details-filters"
          label="Interaction details"
          isOpen={true}
        >
          {/* <Filters.Input
            id="EventsCollection.subject"
            qsParam="subject"
            name="subject"
            label={LABELS.subject}
            data-test="interaction-subject-filter"
          /> */}
          {/* <Filters.CompanyTypeahead
            taskProps={companyListTask}
            isMulti={true}
            label={LABELS.company}
            name="company"
            qsParam="company"
            placeholder="Search company"
            noOptionsMessage="No companies found"
            selectedOptions={selectedFilters.company.options}
            data-test="company-filter"
          /> */}
          <Filters.AdvisersTypeahead
            taskProps={adviserListTask}
            isMulti={true}
            onlyShowActiveAdvisers={false}
            label={LABELS.advisers}
            name="advisers"
            qsParam="ditParticipantsAdviser"
            placeholder="Search adviser"
            noOptionsMessage="No advisers found"
            selectedOptions={selectedFilters.advisers.options}
            data-test="adviser-filter"
          />
          {/* <Filters.Date
            label={LABELS.dateAfter}
            name="date_after"
            qsParamName="date_after"
            data-test="date-after-filter"
          />
          <Filters.Date
            label={LABELS.dateBefore}
            name="date_before"
            qsParamName="date_before"
            data-test="date-before-filter"
          /> */}
          {/* <Filters.CheckboxGroup
            legend={LABELS.businessIntelligence}
            name="was_policy_feedback_provided"
            qsParam="was_policy_feedback_provided"
            options={BUSINESS_INTELLIGENCE_OPTION}
            selectedOptions={selectedFilters.businessIntelligence.options}
            data-test="business-intelligence-filter"
          /> */}
        </FilterToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(CompanyActivityCollection)
