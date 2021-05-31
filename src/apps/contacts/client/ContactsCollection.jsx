import React from 'react'
import { connect } from 'react-redux'

import { CONTACTS__LOADED } from '../../../client/actions'
import { FilteredCollectionList } from '../../../client/components'

import { TASK_GET_CONTACTS_LIST, ID, state2props } from './state'

const ContactsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_CONTACTS_LIST,
    id: ID,
    progressMessage: 'loading contacts',
    startOnRender: {
      payload,
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="Contacts"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/contacts/export"
      entityName="contact"
    ></FilteredCollectionList>
  )
}

export default connect(state2props)(ContactsCollection)
