import React from 'react'

import { Link, Table } from 'govuk-react'

import styled from 'styled-components'

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
  return myTasks.results.map((task) => (
    <Table.Row>
      <Table.Cell setWidth="15%">{formatMediumDate(task.due_date)}</Table.Cell>
      <Table.Cell setWidth="40%">
        <Link
          href={urls.tasks.details(task.id)}
          data-test={`${task.id}-task-link`}
        >
          {task.title}
        </Link>
      </Table.Cell>
      <Table.Cell setWidth="20%">{task.investment_project.name}</Table.Cell>
      <Table.Cell setWidth="25%">{task.advisers[0].name}</Table.Cell>
    </Table.Row>
  ))
}

const MyTasksTable = ({ myTasks }) => (
  <Table head={header} myTasks={myTasks} data-test="my-tasks-table">
    {rows(myTasks)}
  </Table>
)

export default MyTasksTable
