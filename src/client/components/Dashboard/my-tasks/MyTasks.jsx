import React from 'react'
import { connect } from 'react-redux'

import { HintText, Table } from 'govuk-react'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import ContentWithHeading from '../../ContentWithHeading'

const header = (
  <Table.Row>
    <Table.CellHeader>Date due</Table.CellHeader>
    <Table.CellHeader>Task title</Table.CellHeader>
    <Table.CellHeader>Project</Table.CellHeader>
    <Table.CellHeader>Assigned to</Table.CellHeader>
  </Table.Row>
)

const rows = (myTasks) => {
  return myTasks.results.map((task) => (
    <Table.Row>
      <Table.Cell>{task.due_date}</Table.Cell>
      <Table.Cell>{task.title}</Table.Cell>
      <Table.Cell>{task.investment_project.name}</Table.Cell>
      <Table.Cell>{task.advisers[0].name}</Table.Cell>
    </Table.Row>
  ))
}

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
      <ContentWithHeading heading={`${myTasks.count} tasks`}>
        {myTasks.count ? (
          <Table head={header} myTasks={myTasks}>
            {rows(myTasks)}
          </Table>
        ) : (
          <HintText>You do not have any tasks at this time.</HintText>
        )}
      </ContentWithHeading>
    </>
  )
}

export default connect(state2props)(MyTasks)
