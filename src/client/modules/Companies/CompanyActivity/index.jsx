import React from 'react'
import { connect } from 'react-redux'
//import styled from 'styled-components'
import { useParams } from 'react-router-dom'

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
  state2props,
  ID,
  TASK_GET_COMPANY_ACTIVITIES_NO_AS,
  TASK_GET_COMPANY_ACTIVITIES_METADATA,
  TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME,
} from './state'

import { sanitizeFilter } from '../../../../client/filters'

import { CompanyResource } from '../../../components/Resource'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'
import CompanyLayout from '../../../components/Layout/CompanyLayout'

import {
  StyledCollectionItem,
  TitleRenderer,
} from '../../Events/CollectionList'

//TODO - Reinstate these filters when we have the required data in place
/*const FiltersCheckboxGroupWithNext = styled(Filters.CheckboxGroup)({
  marginBottom: 0,
  paddingBottom: 0,
})

const FiltersCheckboxGroupHiddenLegend = styled(Filters.CheckboxGroup)({
  legend: { display: 'none' },
})*/

export const ItemTemplate = (item) => (
  <StyledCollectionItem
    dataTest="interaction"
    headingText={item.headingText}
    headingUrl={item.headingUrl}
    metadata={item.metadata}
    tags={item.tags}
    titleRenderer={TitleRenderer}
    showTagsInMetadata={true}
  />
)

const CompanyActivityCollectionNoAS = ({
  payload,
  company,
  optionMetadata,
  selectedFilters,
  currentAdviserId,
  dnbHierarchyCount,
  ...props
}) => {
  const { companyId } = useParams()

  const collectionListTask = (company) => ({
    name: TASK_GET_COMPANY_ACTIVITIES_NO_AS,
    id: ID,
    progressMessage: 'Loading interactions',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        company: company.id,
      },
      onSuccessDispatch: COMPANY_ACTIVITIES__LOADED,
    },
  })

  const adviserListTask = {
    name: TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME,
    id: ID,
    startOnRender: {
      payload: payload.dit_participants__adviser,
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

  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Activity Feed' }]}
            pageTitle="Activities"
          >
            <FilteredCollectionList
              {...props}
              collectionName="activities"
              sortOptions={optionMetadata.sortOptions}
              taskProps={collectionListTask(company)}
              selectedFilters={selectedFilters}
              entityName="companyActivities"
              sanitizeFiltersForAnalytics={({ advisers, teams }) => ({
                ...sanitizeFilter(advisers),
                ...sanitizeFilter(teams),
              })}
              collectionItemTemplate={ItemTemplate}
              showTagsInMetadata={true}
            >
              <CollectionFilters taskProps={collectionListMetadataTask}>
                {/*<FiltersCheckboxGroupWithNext
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
                />*/}

                <Filters.Input
                  id="subject"
                  label={LABELS.subject}
                  name="subject"
                  qsParam="subject"
                  placeholder="Search subject"
                  data-test="subject-filter"
                />
                <Filters.Date
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
                />
                {dnbHierarchyCount > 0 && (
                  <Filters.RelatedCompaniesCheckboxGroup
                    company={company}
                    selectedOptions={
                      selectedFilters.includeRelatedCompanies.options
                    }
                  />
                )}
                <Filters.RelatedCompaniesCheckboxGroup
                  company={company}
                  selectedOptions={
                    selectedFilters.includeRelatedCompanies.options
                  }
                />
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
                    qsParam="dit_participants__adviser"
                    placeholder="Search adviser"
                    noOptionsMessage="No advisers found"
                    selectedOptions={selectedFilters.advisers.options}
                    data-test="adviser-filter"
                  />
                </FilterToggleSection>
                {/* TODO - reinstate this once we have initial DAGs in place for external items */}
                {/*<Filters.CheckboxGroup
                  legend={LABELS.activityType}
                  name="activityType"
                  qsParam="activityType"
                  options={ACTIVITY_TYPE_OPTIONS}
                  selectedOptions={selectedFilters.activityType.options}
                  data-test="activity-type-filter"
                />*/}
              </CollectionFilters>
            </FilteredCollectionList>
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(state2props)(CompanyActivityCollectionNoAS)
