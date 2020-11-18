import React from 'react'
import { connect } from 'react-redux'

import {
  FilterAdvisersTypeAhead,
  FilterSectorTypeahead,
  CollectionFilters,
  ToggleSection,
  FilteredCollectionList,
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

import { sortOptions, sectorOptions } from './labels'

const ProjectsCollection = ({ payload, optionMetadata, ...props }) => {
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
  return (
    <FilteredCollectionList
      {...props}
      collectionName="Project"
      sortOptions={sortOptions}
      taskProps={collectionListTask}
      selectedSectors={optionMetadata.sectors}
    >
      <CollectionFilters>
        <ToggleSection
          label="Company information"
          id="projects.filters.company.information"
          isOpen={true}
        >
          <FilterAdvisersTypeAhead
            {...props}
            taskProps={adviserListTask}
            isMulti={true}
            label="Advisers"
            name="advisers"
            placeholder="Search advisers..."
            noOptionsMessage={() => <>No advisers found</>}
          />
          <FilterSectorTypeahead
            {...props}
            isMulti={true}
            label="Sector"
            name="sector"
            placeholder="Search sectors..."
            selectedSectors={optionMetadata.sectors}
            options={sectorOptions}
          />
        </ToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(ProjectsCollection)
