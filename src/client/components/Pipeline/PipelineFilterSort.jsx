import React from 'react'
import styled from 'styled-components'

import { spacing } from '@govuk-react/lib'
import Select from '@govuk-react/select'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import { default as Checkbox } from 'data-hub-components/dist/activity-feed/ActivityFeedCheckbox'

import { GREY_4, WHITE } from 'govuk-colours'
import throttle from 'lodash/throttle'

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

const StyledSelect = styled(Select)`
  ${spacing.responsive({
    size: 2,
    property: 'margin',
    direction: ['top'],
  })}

  span {
    ${spacing.responsive({
      size: 1,
      property: 'margin',
      direction: ['left'],
    })}
  }

  select {
    flex: 1;
  }

  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    align-items: center;
    flex-direction: row;
    span {
      ${spacing.responsive({
        size: 1,
        property: 'margin',
        direction: ['right'],
      })}
    }
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
        onChange={() => {
          onClick(!includeArchive)
        }}
        checked={includeArchive}
      >
        Show archived projects
      </Checkbox>
      <StyledSelect
        name="sortBy"
        label="Sort by"
        input={{ value: sortBy }}
        onChange={(event) => {
          updateSort(event.target.value)
        }}
      >
        <option value="-created_on">Most recently created</option>
        <option value="-modified_on">Most recently updated</option>
        <option value="name">Project Name A-Z</option>
      </StyledSelect>
    </StyledSortFilter>
  )
}
