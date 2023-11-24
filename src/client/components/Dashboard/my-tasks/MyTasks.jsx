import React from 'react'
import { connect } from 'react-redux'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import { MyTasksTable } from './MyTasksTable'

const MyTasks = ({ adviser, myTasks }) => {
  return (
    <>
      <Task.Status
        name={TASK_GET_MY_TASKS}
        id={GET_MY_TASKS_ID}
        startOnRender={{
          payload: {
            adviser,
          },
          onSuccessDispatch: MY_TASKS_LOADED,
        }}
      />
      <MyTasksTable myTasks={myTasks} />
    </>
  )
}

export default connect(state2props)(MyTasks)
