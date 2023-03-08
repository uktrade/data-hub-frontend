import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { GREY_1, GREY_2 } from '../../utils/colours'

import EditHistoryChangeList from './EditHistoryChangeList'
import Pagination from '../../components/Pagination'

const StyledListContainer = styled('div')`
  border-top: 2px solid ${GREY_2};
`

const StyledUpdatedOn = styled('p')`
  color: ${GREY_1};
  margin-bottom: 0;
  font-size: ${FONT_SIZE.SIZE_16};
  float: right;
`

function EditHistoryList({
  items,
  totalPages,
  activePage,
  onPageClick,
  getPageUrl,
  changeType,
  getUpdatedBy,
  getValue,
}) {
  return (
    <div data-test="editHistory">
      {items.map(({ timestamp, changes, changedBy }) => (
        <StyledListContainer key={timestamp}>
          <StyledUpdatedOn>
            {getUpdatedBy(timestamp, changedBy)}
          </StyledUpdatedOn>
          <EditHistoryChangeList
            changes={changes}
            changedBy={changedBy}
            changeType={changeType}
            getValue={getValue}
          />
        </StyledListContainer>
      ))}

      <Pagination
        totalPages={totalPages}
        activePage={activePage}
        onPageClick={onPageClick}
        getPageUrl={getPageUrl}
      />
    </div>
  )
}

EditHistoryList.propTypes = {
  items: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
  changeType: PropTypes.string.isRequired,
  getUpdatedBy: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
}

export default EditHistoryList
