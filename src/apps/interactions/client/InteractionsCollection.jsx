import React from 'react'
import { connect } from 'react-redux'

import { INTERACTIONS__LOADED } from '../../../client/actions'
import { LABELS, KIND_OPTIONS } from './constants'

import {
  FilteredCollectionList,
  RoutedCheckboxGroupField,
  CollectionFilters,
} from '../../../client/components'

import { ID, state2props, TASK_GET_INTERACTIONS_LIST } from './state'

const InteractionCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_INTERACTIONS_LIST,
    id: ID,
    progressMessage: 'loading interactions',
    startOnRender: {
      payload,
      onSuccessDispatch: INTERACTIONS__LOADED,
    },
  }
  return (
    <FilteredCollectionList
      {...props}
      collectionName="interaction"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/interactions/export"
      entityName="interactions"
      defaultQueryParams={{
        sortby: 'date:desc',
        page: 1,
      }}
    >
      <CollectionFilters>
        <RoutedCheckboxGroupField
          legend={LABELS.kind}
          name="kind"
          qsParam="kind"
          options={KIND_OPTIONS}
          selectedOptions={selectedFilters.selectedKind}
          data-test="status-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(InteractionCollection)
