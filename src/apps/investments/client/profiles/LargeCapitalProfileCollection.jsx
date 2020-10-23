import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { CollectionList } from '../../../../client/components/'
import { TASK_GET_PROFILES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILE_SELECT_PAGE,
} from '../../../../client/actions'

const LargeCapitalProfileCollection = (props) => {
  const { page } = props

  const collectionListTask = {
    name: TASK_GET_PROFILES_LIST,
    id: ID,
    progressMessage: 'loading profiles...',
    startOnRender: {
      payload: { page },
      onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
    },
  }

  return (
    <Route>
      {(routerProps) => {
        return (
          <CollectionList
            {...props}
            {...routerProps}
            collectionName="Profile"
            taskProps={collectionListTask}
          />
        )
      }}
    </Route>
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__PROFILE_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalProfileCollection)
