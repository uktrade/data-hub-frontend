import React from 'react'
import styled from 'styled-components'

import { spacing } from '@govuk-react/lib'
import { default as Checkbox } from 'data-hub-components/dist/activity-feed/ActivityFeedCheckbox'

import { GREY_4, WHITE } from 'govuk-colours'
import throttle from 'lodash/throttle'

const StyledSortFilter = styled.div`
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
`

export default function PipeLineFilterSort({ updateArchiveFilter, filter }) {
  const { includeArchive } = filter
  const onClick = React.useCallback(throttle(updateArchiveFilter, 500), [])
  return (
    <StyledSortFilter>
      <Checkbox
        data-auto-id="pipeline-filter-archive"
        onChange={() => {
          onClick(!includeArchive)
        }}
        checked={includeArchive}
      >
        Show archived projects
      </Checkbox>
    </StyledSortFilter>
  )
}
