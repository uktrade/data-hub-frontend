import React from 'react'
import { GridCol } from 'govuk-react'

const CollectionFilters = ({ children }) => {
  return (
    <GridCol setWidth="one-third">
      <aside>{children}</aside>
    </GridCol>
  )
}

export default CollectionFilters
