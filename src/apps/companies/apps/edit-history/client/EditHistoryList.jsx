import React from 'react'
import PropTypes from 'prop-types'
import DateUtils from 'data-hub-components/dist/utils/DateUtils'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'

import EditHistoryChangeList from './EditHistoryChangeList'
import { AUTOMATIC_UPDATE } from '../constants'

const StyledListContainer = styled('div')`
  border-top: 2px solid ${GREY_2};
`

const StyledUpdatedOn = styled('p')`
  color: ${GREY_2};
  margin-bottom: 0;
  font-size: ${FONT_SIZE.SIZE_16};
  float: right;
`

const getUpdatedBy = (timestamp, changedBy) => {
  const formattedTime = DateUtils.formatWithTime(timestamp)
  return changedBy === AUTOMATIC_UPDATE
    ? `Automatically updated on ${formattedTime}`
    : `Updated on ${formattedTime} by ${changedBy}`
}

function EditHistoryList ({ items }) {
  return (
    <div>
      {items.map(({ timestamp, changes, changedBy }, index) => (
        <StyledListContainer key={timestamp}>
          <StyledUpdatedOn>{getUpdatedBy(timestamp, changedBy)}</StyledUpdatedOn>
          <EditHistoryChangeList
            changes={changes}
            changedBy={changedBy}
          />
        </StyledListContainer>
      ))}
    </div>
  )
}

EditHistoryList.propTypes = {
  items: PropTypes.array.isRequired,
}

export default EditHistoryList
