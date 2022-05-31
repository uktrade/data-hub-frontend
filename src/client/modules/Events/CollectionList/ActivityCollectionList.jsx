import { GridCol } from 'govuk-react'
import React from 'react'
import CollectionList from '.'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'

const ActivityCollectionList = () => {
  const collectionListTask = {
    name: TASK_GET_EVENTS_LIST,
    id: ID,
    progressMessage: 'Loading events',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: EVENTS__LOADED,
    },
  }

  return (
    <GridCol setWidth="full">
      <p>activity stream</p>
      <CollectionList
        taskProps={collectionListTask}
        items={results}
        count={count}
        isComplete={isComplete}
        metadataRenderer={metadataRenderer}
      />
    </GridCol>
  )
}

export default ActivityCollectionList
