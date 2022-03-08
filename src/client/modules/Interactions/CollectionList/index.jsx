import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import {
  INTERACTIONS__LOADED,
  INTERACTIONS_SELECTED_ADVISERS,
  INTERACTIONS__METADATA_LOADED,
  INTERACTIONS_SELECTED_TEAMS,
} from '../../../actions'

import { LABELS, KIND_OPTIONS, BUSINESS_INTELLIGENCE_OPTION } from './constants'

import {
  CollectionFilters,
  FilteredCollectionList,
  FilterToggleSection,
  Filters,
  DefaultLayout,
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
  TASK_GET_INTERACTIONS_LIST,
  TASK_GET_INTERACTIONS_ADVISER_NAME,
  TASK_GET_INTERACTIONS_METADATA,
  TASK_GET_INTERACTIONS_TEAM_NAME,
} from './state'

const StyledCheckboxGroup = styled(Filters.CheckboxGroup)`
  /* This just tightens up the gap for when a single checkbox option group
  (with no label) is beneath a multiple checkbox option group */
  margin-bottom: ${SPACING.SCALE_2};
`

const InteractionCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  currentAdviserId,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_INTERACTIONS_LIST,
    id: ID,
    progressMessage: 'Loading interactions',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: INTERACTIONS__LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_INTERACTIONS_ADVISER_NAME,
    id: ID,
    progressMessage: 'Loading advisers',
    startOnRender: {
      payload: payload.dit_participants__adviser,
      onSuccessDispatch: INTERACTIONS_SELECTED_ADVISERS,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_INTERACTIONS_METADATA,
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
      onSuccessDispatch: INTERACTIONS__METADATA_LOADED,
    },
  }

  const myInteractionsSelected = selectedFilters.advisers.options
    .map(({ value }) => value)
    .includes(currentAdviserId)

  const myInteractionsOption = {
    label: LABELS.myInteractions,
    value: currentAdviserId,
  }

  const teamListTask = {
    name: TASK_GET_INTERACTIONS_TEAM_NAME,
    id: ID,
    progressMessage: 'Loading teams',
    startOnRender: {
      payload: payload.dit_participants__team,
      onSuccessDispatch: INTERACTIONS_SELECTED_TEAMS,
    },
  }

  return (
    <DefaultLayout heading="Interactions" pageTitle="Interactions">
      <FilteredCollectionList
        {...props}
        collectionName="interaction"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        baseDownloadLink="/interactions/export"
        entityName="interaction"
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          <Filters.CheckboxGroup
            legend={LABELS.myInteractions}
            name="my_interactions"
            qsParam="dit_participants__adviser"
            options={[myInteractionsOption]}
            selectedOptions={
              myInteractionsSelected ? [myInteractionsOption] : []
            }
            data-test="my-interactions-filter"
          />
          <StyledCheckboxGroup
            legend={LABELS.kind}
            name="kind"
            qsParam="kind"
            options={KIND_OPTIONS}
            selectedOptions={selectedFilters.kind.options}
            data-test="status-filter"
          />
          <FilterToggleSection
            id="InteractionCollection.interaction-details-filters"
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
            <Filters.TeamsTypeahead
              taskProps={teamListTask}
              isMulti={true}
              label={LABELS.teams}
              name="dit_participants__team"
              qsParam="dit_participants__team"
              placeholder="Search teams"
              noOptionsMessage="No teams found"
              selectedOptions={selectedFilters.teams.options}
              data-test="team-filter"
            />
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.sector}
              name="sector"
              qsParam="sector_descends"
              placeholder="Search sector"
              options={optionMetadata.sectorOptions}
              selectedOptions={selectedFilters.sectors.options}
              data-test="sector-filter"
            />
            <Filters.CheckboxGroup
              legend={LABELS.businessIntelligence}
              name="was_policy_feedback_provided"
              qsParam="was_policy_feedback_provided"
              options={BUSINESS_INTELLIGENCE_OPTION}
              selectedOptions={selectedFilters.businessIntelligence.options}
              data-test="business-intelligence-filter"
            />
            <Filters.CheckboxGroup
              maxScrollHeight={370}
              legend={LABELS.companyOneListGroupTier}
              name="company_one_list_group_tier"
              qsParam="company_one_list_group_tier"
              options={optionMetadata.companyOneListTierOptions}
              selectedOptions={selectedFilters.companyOneListGroupTier.options}
              data-test="company-one-list-group-tier-filter"
            />
          </FilterToggleSection>

          <FilterToggleSection
            id="InteractionCollection.service-details-filters"
            label="Service details"
            isOpen={false}
          >
            <Filters.CheckboxGroup
              maxScrollHeight={350}
              legend={LABELS.service}
              name="service"
              qsParam="service"
              options={optionMetadata.serviceOptions}
              selectedOptions={selectedFilters.service.options}
              data-test="service-filter"
              groupId="service-filter"
            />
          </FilterToggleSection>

          <FilterToggleSection
            id="InteractionCollection.policy-details-filters"
            label="Policy details"
            isOpen={false}
          >
            <Filters.CheckboxGroup
              maxScrollHeight={345}
              legend={LABELS.policyAreas}
              name="policy_areas"
              qsParam="policy_areas"
              options={optionMetadata.policyAreaOptions}
              selectedOptions={selectedFilters.policyArea.options}
              data-test="policy-area-filter"
              groupId="policy-area-filter"
            />
            <Filters.CheckboxGroup
              legend={LABELS.policyIssueType}
              name="policy_issue_types"
              qsParam="policy_issue_types"
              options={optionMetadata.policyIssueTypeOptions}
              selectedOptions={selectedFilters.policyIssueType.options}
              data-test="policy-issue-type-filter"
              groupId="policy-issue-type-filter"
            />
          </FilterToggleSection>
        </CollectionFilters>
      </FilteredCollectionList>
    </DefaultLayout>
  )
}

export default connect(state2props)(InteractionCollection)
