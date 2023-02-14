import React from 'react'
import { GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'
import { H2 } from '@govuk-react/heading'
import { LEVEL_SIZE } from '@govuk-react/constants'

const CollectionFilters = ({ children, taskProps }) => {
  return (
    <GridCol setWidth="one-third">
      <Task.Status {...taskProps}>
        {() => (
          <nav aria-label="Filters" data-test="collection-filters">
            <H2 size={LEVEL_SIZE[3]}>Filters</H2>
            {children}
          </nav>
        )}
      </Task.Status>
    </GridCol>
  )
}

export default CollectionFilters
