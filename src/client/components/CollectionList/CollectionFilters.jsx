import React from 'react'
import { GridCol } from 'govuk-react'
import { H2 } from '@govuk-react/heading'
import { FONT_WEIGHTS, HEADING_SIZES } from '@govuk-react/constants'
import styled from 'styled-components'

import Task from '../../../client/components/Task'

const FilterHeader = styled(H2)({
  marginTop: 0,
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: HEADING_SIZES.MEDIUM,
  marginBottom: 0,
})

const CollectionFilters = ({ children, taskProps }) => {
  return (
    <GridCol setWidth="one-third">
      <Task.Status {...taskProps}>
        {() => (
          <nav aria-label="Filters" data-test="collection-filters">
            <FilterHeader>Filters</FilterHeader>
            {children}
          </nav>
        )}
      </Task.Status>
    </GridCol>
  )
}

export default CollectionFilters
