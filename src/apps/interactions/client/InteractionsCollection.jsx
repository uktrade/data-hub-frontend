import React from 'react'
import { connect } from 'react-redux'

import { INTERACTIONS__LOADED } from '../../../client/actions'
import { INTERACTION, SERVICE_DELIVERY } from './constants'

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
      collectionName={INTERACTION.label}
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
          legend="Kind"
          name="kind"
          qsParam="kind"
          options={[
            {
              label: INTERACTION.label,
              value: INTERACTION.value,
            },
            {
              label: SERVICE_DELIVERY.label,
              value: SERVICE_DELIVERY.value,
            },
          ]}
          selectedOptions={selectedFilters.selectedKind}
          data-test="status-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(InteractionCollection)
