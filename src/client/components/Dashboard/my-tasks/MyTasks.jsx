import React from 'react'
import { connect } from 'react-redux'

import { HintText, Table } from 'govuk-react'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import ContentWithHeading from '../../ContentWithHeading'

const MyTasks = ({ adviser, myTasks }) => {
  const header = (
    <Table.Row>
      <Table.CellHeader>Date due</Table.CellHeader>
      <Table.CellHeader>Task title</Table.CellHeader>
      <Table.CellHeader>Project</Table.CellHeader>
      <Table.CellHeader>Assigned to</Table.CellHeader>
    </Table.Row>
  )

  const rows = (
    <Table.Row>
      <Table.Cell>myResults</Table.Cell>
      <Table.Cell>A title would go here</Table.Cell>
      <Table.Cell>This is the project</Table.Cell>
      <Table.Cell>It is assigned to</Table.Cell>
    </Table.Row>
  )

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
          <Table head={header}>{rows}</Table>
        ) : (
          <HintText>You do not have any tasks at this time.</HintText>
        )}
      </ContentWithHeading>
    </>
  )
}

export default connect(state2props)(MyTasks)
