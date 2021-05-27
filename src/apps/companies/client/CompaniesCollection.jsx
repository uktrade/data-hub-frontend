import React from 'react'
import { connect } from 'react-redux'

import { COMPANIES__LOADED } from '../../../client/actions'
import { FilteredCollectionList } from '../../../client/components'

import { TASK_GET_COMPANIES_LIST, ID, state2props } from './state'

const CompaniesCollection = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_COMPANIES_LIST,
    id: ID,
    progressMessage: 'loading companies',
    startOnRender: {
      payload,
      onSuccessDispatch: COMPANIES__LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="Company"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/companies/export"
      entityName="company"
      entityNamePlural="companies"
    ></FilteredCollectionList>
  )
}

export default connect(state2props)(CompaniesCollection)
