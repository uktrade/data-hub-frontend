import React from 'react'
import { connect } from 'react-redux'

import { MY_TASKS_LOADED } from '../../../actions'
import { ID, TASK_GET_MY_TASKS, state2props } from './state'
import Task from '../../../components/Task'

const MyTasks = (currentAdviserId) => {
  return (
    <>
      <h1>Hello Tasks</h1>
      <Task.Status
        name={TASK_GET_MY_TASKS}
        id={ID}
        startOnRender={{
          payload: { currentAdviserId: currentAdviserId },
          onSuccessDispatch: MY_TASKS_LOADED,
        }}
      />
    </>
  )
}

export default connect(state2props)(MyTasks)
