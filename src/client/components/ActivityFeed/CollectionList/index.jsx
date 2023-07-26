import React from 'react'
import { connect } from 'react-redux'

import {
  COMPANY_ACTIVITIES__LOADED,
  COMPANY_ACTIVITIES_SELECTED_ADVISERS,
  COMPANY_ACTIVITIES__METADATA_LOADED,
} from '../../../actions'

import { ACTIVITY_TYPE_OPTIONS, LABELS } from './constants'

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

import { CompanyResource } from '../../Resource'
import CompanyLayout from '../../Layout/CompanyLayout'
import styled from 'styled-components'

const FiltersCheckboxGroupWithNext = styled(Filters.CheckboxGroup)({
  marginBottom: 0,
  paddingBottom: 0,
})

const FiltersCheckboxGroupHiddenLegend = styled(Filters.CheckboxGroup)({
  legend: { display: 'none' },
})

const collectionItemTemplateDefault = (activity) => {
  return (
    <li key={activity.id}>
      <Activity {...activity} activity={activity} key={activity.id} />
    </li>
  )
}

const CompanyActivityCollection = ({
  payload,
  companyId,
  company,
  optionMetadata,
  selectedFilters,
  currentAdviserId,
  dnbHierarchyCount,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
  returnUrl,
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

  const createdByMeSelected = selectedFilters.advisers.options
    .map(({ value }) => value)
    .includes(currentAdviserId)

  const myInteractionsOption = {
    label: LABELS.me,
    value: currentAdviserId,
  }

  const createdByOthersOption = {
    label: LABELS.others,
    value: currentAdviserId,
  }

  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <CompanyLayout
          company={company}
          breadcrumbs={[{ text: 'Activity Feed' }]}
          dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
          localNavItems={localNavItems}
          flashMessages={flashMessages}
          returnUrl={returnUrl}
        >
          <FilteredCollectionList
            {...props}
            collectionName="activities"
            sortOptions={optionMetadata.sortOptions}
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
              <FiltersCheckboxGroupWithNext
                legend={LABELS.createdBy}
                name="my_interactions"
                qsParam="ditParticipantsAdviser"
                options={[myInteractionsOption]}
                selectedOptions={
                  createdByMeSelected ? [myInteractionsOption] : []
                }
                data-test="my-interactions-filter"
              />
              <FiltersCheckboxGroupHiddenLegend
                legend={LABELS.createdBy}
                name="created_by_others"
                qsParam="createdByOthers"
                options={[createdByOthersOption]}
                selectedOptions={selectedFilters.createdByOthers.options}
                data-test="created-by-others-filter"
              />
              <Filters.Date
                label={LABELS.dateAfter}
                name="date_after"
                qsParamName="dateAfter"
                data-test="date-after-filter"
              />
              <Filters.Date
                label={LABELS.dateBefore}
                name="date_before"
                qsParamName="dateBefore"
                data-test="date-before-filter"
              />
              {dnbHierarchyCount > 0 && (
                <Filters.RelatedCompaniesCheckboxGroup
                  company={company}
                  selectedOptions={
                    selectedFilters.includeRelatedCompanies.options
                  }
                />
              )}
              <FilterToggleSection
                id="CompanyActivityCollection.interaction-details-filters"
                label="Interaction details"
                isOpen={true}
              >
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
              </FilterToggleSection>
              <Filters.CheckboxGroup
                legend={LABELS.activityType}
                name="activityType"
                qsParam="activityType"
                options={ACTIVITY_TYPE_OPTIONS}
                selectedOptions={selectedFilters.activityType.options}
                data-test="activity-type-filter"
              />
            </CollectionFilters>
          </FilteredCollectionList>
        </CompanyLayout>
      )}
    </CompanyResource>
  )
}

export default connect(state2props)(CompanyActivityCollection)
