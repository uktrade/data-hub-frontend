import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { throttle } from 'lodash'

import {
  RoutedAdvisersTypeahead,
  RoutedTypeahead,
  CollectionFilters,
  ToggleSection,
  FilteredCollectionList,
  RoutedDateField,
  RoutedCheckboxGroupField,
} from '../../../../client/components'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_ADVISER_NAME,
  ID,
  state2props,
} from './state'

import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
} from '../../../../client/actions'

const ProjectsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_PROJECTS_LIST,
    id: ID,
    progressMessage: 'loading projects...',
    startOnRender: {
      payload,
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_ADVISER_NAME,
    id: ID,
    progressMessage: 'loading advisers...',
    startOnRender: {
      payload: payload.adviser,
      onSuccessDispatch: INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
    },
  }
  const fetchMetadataOptions = (endpoint) => {
    return throttle(
      () =>
        axios
          .get(`/api-proxy/v4/metadata/${endpoint}`)
          .then(({ data }) =>
            data.map(({ id, name }) => ({ value: id, label: name }))
          ),
      500
    )
  }
  const fetchSectorOptions = () => {
    return throttle(
      (searchString) =>
        axios
          .get('/api-proxy/v4/metadata/sector', {
            params: searchString ? { autocomplete: searchString } : {},
          })
          .then(({ data }) =>
            data
              .filter(({ level }) => level === 0)
              .map(({ id, name }) => ({ value: id, label: name }))
          ),
      500
    )
  }
  return (
    <FilteredCollectionList
      {...props}
      collectionName="Project"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/investments/projects/export"
    >
      <CollectionFilters>
        <ToggleSection
          label="Company information"
          data-cy="company-information-filters"
          isOpen={true}
        >
          <RoutedCheckboxGroupField
            label="Stage"
            name="stage"
            qsParam="stage"
            loadOptions={fetchMetadataOptions('investment-project-stage')}
            selectedOptions={selectedFilters.selectedStages}
            data-cy="stage-filter"
          />
          <RoutedAdvisersTypeahead
            taskProps={adviserListTask}
            isMulti={true}
            label="Advisers"
            name="adviser"
            qsParam="adviser"
            placeholder="Search advisers..."
            noOptionsMessage={() => <>No advisers found</>}
            selectedOptions={selectedFilters.selectedAdvisers}
            data-cy="adviser-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label="Sector"
            name="sector"
            qsParam="sector_descends"
            placeholder="Search sectors..."
            loadOptions={fetchSectorOptions()}
            selectedOptions={selectedFilters.selectedSectors}
            data-cy="sector-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label="Country of origin"
            name="country"
            qsParam="country"
            placeholder="Search countries..."
            loadOptions={fetchMetadataOptions('country')}
            selectedOptions={selectedFilters.selectedCountries}
            data-cy="country-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label="UK Region"
            name="uk_region"
            qsParam="uk_region"
            placeholder="Search UK regions..."
            loadOptions={fetchMetadataOptions('uk-region')}
            selectedOptions={selectedFilters.selectedUkRegions}
            data-cy="uk-region-filter"
          />
          <RoutedCheckboxGroupField
            label="Status"
            name="project_status"
            qsParam="status"
            options={optionMetadata.projectStatusOptions}
            selectedOptions={selectedFilters.selectedProjectStatuses}
            data-cy="project-status-filter"
          />
          <RoutedCheckboxGroupField
            label="Type of investment"
            name="investment_type"
            qsParam="investment_type"
            loadOptions={fetchMetadataOptions('investment-type')}
            selectedOptions={selectedFilters.selectedInvestmentTypes}
            data-cy="investment-type-filter"
          />
          <RoutedCheckboxGroupField
            label="Likelihood to land"
            name="likelihood_to_land"
            qsParam="likelihood_to_land"
            loadOptions={fetchMetadataOptions('likelihood-to-land')}
            selectedOptions={selectedFilters.selectedLikelihoodToLands}
            data-cy="likelihood-to-land-filter"
          />
          <RoutedDateField
            label="Estimated land date before"
            name="estimated_land_date_before"
            qsParamName="estimated_land_date_before"
            data-cy="estimated-land-date-before-filter"
          />
          <RoutedDateField
            label="Estimated land date after"
            name="estimated_land_date_after"
            qsParamName="estimated_land_date_after"
            data-cy="estimated-land-date-after-filter"
          />
          <RoutedDateField
            label="Actual land date before"
            name="actual_land_date_before"
            qsParamName="actual_land_date_before"
            data-cy="actual-land-date-before-filter"
          />
          <RoutedDateField
            label="Actual land date after"
            name="actual_land_date_after"
            qsParamName="actual_land_date_after"
            data-cy="actual-land-date-after-filter"
          />
          <RoutedCheckboxGroupField
            label="Level of involvement specified"
            name="involvement_level"
            qsParam="level_of_involvement_simplified"
            options={optionMetadata.involvementLevelOptions}
            selectedOptions={selectedFilters.selectedInvolvementLevels}
            data-cy="involvement-level-filter"
          />
        </ToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  )
}
export default connect(state2props)(ProjectsCollection)
