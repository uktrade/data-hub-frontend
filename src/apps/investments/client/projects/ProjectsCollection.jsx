import React from 'react'
import { connect } from 'react-redux'

import {
  FilterAdvisersTypeAhead,
  CollectionFilters,
  ToggleSection,
  CollectionList,
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

import { sortOptions } from './labels'

const ProjectsCollection = ({ payload, ...props }) => {
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
    <CollectionList
      {...props}
      collectionName="Project"
      sortOptions={sortOptions}
      taskProps={collectionListTask}
    >
      <CollectionFilters>
        <ToggleSection
          label="Company information"
          id="projects.filters.company.information"
        >
          <FilterAdvisersTypeAhead
            {...props}
            taskProps={adviserListTask}
            isMulti={true}
            label="Advisers"
            name="advisers"
            placeholder="Search advisers..."
            noOptionsMessage={() => <span>No advisers found</span>}
          />
        </ToggleSection>
      </CollectionFilters>
    </CollectionList>
  )
}

export default connect(state2props, null)(ProjectsCollection)
