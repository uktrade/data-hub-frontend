import React from 'react'
import { GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'

const CollectionFilters = ({ children, taskProps }) => {
  return (
    <GridCol setWidth="one-third">
      <Task.Status {...taskProps}>
        {() => (
          <nav aria-label="Filters" data-test="collection-filters">
            {children}
          </nav>
        )}
      </Task.Status>
    </GridCol>
  )
}

export default CollectionFilters
