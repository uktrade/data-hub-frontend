import React from 'react'
import { connect } from 'react-redux'

import { HintText } from 'govuk-react'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import ContentWithHeading from '../../ContentWithHeading'
import MyTasksTable from './MyTasksTable'

const MyTasks = ({ adviser, myTasks }) => (
  <Task.Status
    name={TASK_GET_MY_TASKS}
    id={GET_MY_TASKS_ID}
    progressMessage="Loading your tasks"
    startOnRender={{
      payload: {
        adviser,
      },
      onSuccessDispatch: MY_TASKS_LOADED,
    }}
  >
    {() => (
      <ContentWithHeading
        heading={`${myTasks?.count} ${myTasks?.count == 1 ? 'task' : 'tasks'}`}
        data-test="my-tasks-heading"
      >
        {myTasks ? (
          <MyTasksTable myTasks={myTasks} />
        ) : (
          <HintText>You do not have any tasks at this time.</HintText>
        )}
      </ContentWithHeading>
    )}
  </Task.Status>
)

export default connect(state2props)(MyTasks)
