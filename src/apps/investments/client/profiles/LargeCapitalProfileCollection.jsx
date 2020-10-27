import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../../client/components/'
import { TASK_GET_PROFILES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILE_SELECT_PAGE,
} from '../../../../client/actions'

const LargeCapitalProfileCollection = ({ payload, ...props }) => {
  const collectionListTask = {
    name: TASK_GET_PROFILES_LIST,
    id: ID,
    progressMessage: 'loading profiles...',
    startOnRender: {
      payload,
      onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
    },
  }

  return (
    <CollectionList
      {...props}
      collectionName="Profile"
      taskProps={collectionListTask}
    />
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
