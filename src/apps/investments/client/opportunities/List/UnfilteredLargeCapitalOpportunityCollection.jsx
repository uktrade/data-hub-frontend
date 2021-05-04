import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../../../client/components'
import { TASK_GET_OPPORTUNITIES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../../client/actions'

const LargeCapitalOpportunityCollection = ({
  page,
  count,
  results,
  onPageClick,
  isComplete,
}) => (
  <CollectionList
    taskProps={{
      name: TASK_GET_OPPORTUNITIES_LIST,
      id: ID,
      progressMessage: 'loading opportunities...',
      startOnRender: {
        payload: { page },
        onSuccessDispatch: INVESTMENTS__OPPORTUNITIES_LOADED,
      },
    }}
    collectionName="Opportunity"
    items={results}
    count={count}
    onPageClick={onPageClick}
    activePage={page}
    isComplete={isComplete}
    entityName="opportunity"
    entityNamePlural="opportunities"
    addItemUrl="/investments/opportunities/create"
    baseDownloadLink="/investments/opportunities/export"
  />
)

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalOpportunityCollection)
