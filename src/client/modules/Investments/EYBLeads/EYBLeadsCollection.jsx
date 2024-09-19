import React from 'react'

import { FilteredCollectionList, StatusMessage } from '../../../components'

const EYBLeadCollection = () => {
  return (
    <>
      <StatusMessage>
        <strong>Work in progress</strong>
        <p>
          {' '}
          We are working to add Expand Your Business (EYB) data to Data Hub. It
          will be available here soon.
        </p>
      </StatusMessage>
      <FilteredCollectionList
        collectionName="eybLead"
        entityName="eybLead"
      ></FilteredCollectionList>
    </>
  )
}

export default EYBLeadCollection
