import React from 'react'
import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import { default as Checkbox } from '../ActivityFeed/ActivityFeedCheckbox'
import { GREY_4, WHITE } from 'govuk-colours'
import throttle from 'lodash/throttle'

import { Select } from '..'

const StyledSortFilter = styled.div`
  display: flex;
  flex-direction: column;
  ${spacing.responsive({
    size: 3,
    property: 'padding',
    direction: ['left', 'right'],
  })}
  ${spacing.responsive({
    size: 2,
    property: 'padding',
    direction: ['top', 'bottom'],
  })}
  background-color: ${GREY_4};

  span:before {
    background-color: ${WHITE};
  }

}
${MEDIA_QUERIES.TABLET} {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
`

export default function PipeLineFilterSort({
  updateArchiveFilter,
  updateSort,
  filter,
}) {
  const { includeArchive, sortBy } = filter

  const onClick = React.useCallback(throttle(updateArchiveFilter, 500), [])
  return (
    <StyledSortFilter>
      <Checkbox
        data-auto-id="pipeline-filter-archive"
        aria-label="show archived projects"
        onChange={() => {
          onClick(!includeArchive)
        }}
        checked={includeArchive}
      >
        Show archived projects
      </Checkbox>
      <Select
        name="sortBy"
        label="Sort by"
        htmlFor="sort-by"
        input={{
          id: 'sort-by',
          initialValue: sortBy,
          onChange: (event) => updateSort(event.target.value),
        }}
      >
        <option value="-created_on" aria-label="most recently created">
          Most recently created
        </option>
        <option value="-modified_on" aria-label="most recently updated">
          Most recently updated
        </option>
        <option value="name" aria-label="project name a to z">
          Project Name A-Z
        </option>
      </Select>
    </StyledSortFilter>
  )
}
