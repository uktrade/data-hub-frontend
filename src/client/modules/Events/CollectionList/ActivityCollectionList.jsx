import { GridCol } from 'govuk-react'
import React from 'react'
import { CollectionList } from '../../../components'

const ActivityCollectionList = ({ collectionListTask, results }) => {
  console.log(results)

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
