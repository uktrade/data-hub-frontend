import React from 'react'
import { connect } from 'react-redux'

import { HintText, Link, Table } from 'govuk-react'

import styled from 'styled-components'

import { orderBy } from 'lodash'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import ContentWithHeading from '../../ContentWithHeading'
import { formatMediumDate } from '../../../utils/date'
import urls from '../../../../lib/urls'

const StyledTableCellHeader = styled(Table.CellHeader)`
  padding-top: 0px;
`

const header = (
  <Table.Row>
    <StyledTableCellHeader>Date due</StyledTableCellHeader>
    <StyledTableCellHeader>Task title</StyledTableCellHeader>
    <StyledTableCellHeader>Project</StyledTableCellHeader>
    <StyledTableCellHeader>Assigned to</StyledTableCellHeader>
  </Table.Row>
)

const rows = (myTasks) => {
  const orderedMyTasks = orderBy(
    myTasks.results,
    [(c) => c.due_date || ''],
    ['asc']
  )
  return orderedMyTasks.map((task) => (
    <Table.Row>
      <Table.Cell>{formatMediumDate(task.due_date)}</Table.Cell>
      <Table.Cell>
        <Link href={urls.tasks.details(task.id)}>{task.title}</Link>
      </Table.Cell>
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
      <ContentWithHeading
        heading={`${myTasks.count} tasks`}
        data-test="my-tasks-heading"
      >
        {myTasks.count ? (
          <Table head={header} myTasks={myTasks} data-test="my-tasks-table">
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
