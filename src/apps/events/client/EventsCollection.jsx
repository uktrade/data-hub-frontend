import React from 'react'
import { connect } from 'react-redux'

import { EVENTS__LOADED } from '../../../client/actions'
import { FilteredCollectionList } from '../../../client/components'

import { ID, TASK_GET_EVENTS_LIST, state2props } from './state'

const EventsCollection = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_EVENTS_LIST,
    id: ID,
    progressMessage: 'Loading events',
    startOnRender: {
      payload,
      onSuccessDispatch: EVENTS__LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="event"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      entityName="event"
      entityNamePlural="events"
      addItemUrl="/events/create"
      defaultQueryParams={{
        page: 1,
      }}
    ></FilteredCollectionList>
  )
}

export default connect(state2props)(EventsCollection)
