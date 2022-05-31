import { GridCol } from 'govuk-react'
import React from 'react'
import { CollectionList } from '../../../components'
import { EVENTS_ACTIVITIES__LOADED } from '../../../actions'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'
import { ID, TASK_GET_EVENTS_ACTIVITIES } from './state'

const ActivityCollectionList = ({ payload, results }) => {
  console.log('activity comp')
  console.log(results)
  const collectionListTask = {
    name: TASK_GET_EVENTS_ACTIVITIES,
    id: ID,
    progressMessage: 'Loading events',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: EVENTS_ACTIVITIES__LOADED,
    },
  }

  return (
    <GridCol setWidth="full">
      <p>activity stream</p>
      <CollectionList
        taskProps={collectionListTask}
        collectionName="events"
        itemsPerPage={50}
        onPageClick={() => {}}
        items={results}
      />
    </GridCol>
  )
}

export default ActivityCollectionList
