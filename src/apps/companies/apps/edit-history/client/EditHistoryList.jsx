import React from 'react'
import PropTypes from 'prop-types'
import { DateUtils, Pagination } from 'data-hub-components'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { GREY_1, GREY_2 } from 'govuk-colours'

import EditHistoryChangeList from './EditHistoryChangeList'
import { AUTOMATIC_UPDATE } from '../constants'

const StyledListContainer = styled('div')`
  border-top: 2px solid ${GREY_2};
`

const StyledUpdatedOn = styled('p')`
  color: ${GREY_1};
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

function EditHistoryList({ items, totalPages, activePage, onPageClick }) {
  return (
    <div data-auto-id="editHistory">
      {items.map(({ timestamp, changes, changedBy }) => (
        <StyledListContainer key={timestamp}>
          <StyledUpdatedOn>
            {getUpdatedBy(timestamp, changedBy)}
          </StyledUpdatedOn>
          <EditHistoryChangeList changes={changes} changedBy={changedBy} />
        </StyledListContainer>
      ))}

      <Pagination
        totalPages={totalPages}
        activePage={activePage}
        onPageClick={onPageClick}
      />
    </div>
  )
}

EditHistoryList.propTypes = {
  items: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
}

export default EditHistoryList
