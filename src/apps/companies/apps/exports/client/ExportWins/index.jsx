import React from 'react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { CollectionList } from '../../../../../../client/components/'

import { connect } from 'react-redux'
import { state2props, NOT_IMPLEMENTED } from './state'
import {
  EXPORT_WINS__LOADED,
  EXPORT_WINS__SELECT_PAGE,
} from '../../../../../../client/actions'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

function ExportWins(state) {
  if (state[NOT_IMPLEMENTED]) {
    return null
  }

  const {
    count,
    results,
    onPageClick,
    activePage,
    companyId,
    companyName,
    isComplete,
  } = state

  const collectionListTask = {
    name: 'Export wins',
    id: 'exportWins',
    progressMessage: 'Loading Exports Wins...',
    startOnRender: {
      payload: { companyId, companyName, activePage },
      onSuccessDispatch: EXPORT_WINS__LOADED,
    },
  }

  return (
    <Wrapper>
      <CollectionList
        taskProps={collectionListTask}
        items={results}
        count={count}
        onPageClick={onPageClick}
        activePage={activePage}
        routedPagination={false}
        isComplete={isComplete}
      />
    </Wrapper>
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: EXPORT_WINS__SELECT_PAGE,
      page,
    })
  },
}))(ExportWins)
