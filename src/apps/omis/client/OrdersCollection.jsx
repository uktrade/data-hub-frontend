import React from 'react'
import { connect } from 'react-redux'

import { ORDERS__LOADED } from '../../../client/actions'
import { FilteredCollectionList } from '../../../client/components'
import { ID, TASK_GET_ORDERS_LIST, state2props } from './state'

const OrdersCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_ORDERS_LIST,
    id: ID,
    progressMessage: 'Loading orders',
    startOnRender: {
      payload,
      onSuccessDispatch: ORDERS__LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="order"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      entityName="order"
      entityNamePlural="order"
      addItemUrl="/omis/create"
      defaultQueryParams={{
        page: 1,
      }}
    ></FilteredCollectionList>
  )
}

export default connect(state2props)(OrdersCollection)
