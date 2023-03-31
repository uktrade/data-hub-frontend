import React from 'react'
import { connect } from 'react-redux'

import Task from '../../../components/Task'
import { EXPORT__PIPELINE_LIST_LOADED } from '../../../actions'
import { ID, TASK_GET_EXPORT_PIPELINE_LIST, state2props } from './state'

import List from './List'
import ListItemRenderer from './ItemRenderer'

const ExportList = (data) => (
  <Task.Status
    name={TASK_GET_EXPORT_PIPELINE_LIST}
    id={ID}
    progressMessage="loading export pipeline list"
    startOnRender={{
      onSuccessDispatch: EXPORT__PIPELINE_LIST_LOADED,
    }}
  >
    {() => <List items={data.results} itemRenderer={ListItemRenderer} />}
  </Task.Status>
)

export default connect(state2props)(ExportList)
