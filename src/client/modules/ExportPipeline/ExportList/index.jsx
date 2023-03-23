import React from 'react'

import Task from '../../../components/Task'
import { EXPORT__PIPELINE_LIST_LOADED } from '../../../actions'
import { ID, TASK_GET_EXPORT_PIPELINE_LIST } from './state'

const ExportList = (data) => (
  <Task.Status
    name={TASK_GET_EXPORT_PIPELINE_LIST}
    id={ID}
    progressMessage="loading export pipeline list"
    startOnRender={{
      onSuccessDispatch: EXPORT__PIPELINE_LIST_LOADED,
    }}
  >
    {() => (
      <pre>
        <code>{JSON.stringify(data.results, null, 2)}</code>
      </pre>
    )}
  </Task.Status>
)

export default ExportList
