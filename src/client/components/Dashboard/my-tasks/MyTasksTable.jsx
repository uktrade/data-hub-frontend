import React from 'react'

import { Link, Table } from 'govuk-react'

import styled from 'styled-components'

import { formatDate, DATE_FORMAT_MEDIUM } from '../../../utils/date-utils'
import urls from '../../../../lib/urls'
import { STATUS } from '../../../modules/Tasks/TaskForm/constants'

export const transformAdvisersListItem = (advisers) => {
  return advisers.map((adviser, index) => (
    <li key={`task_adviser_${index}`}>{adviser?.name}</li>
  ))
}

const StyledTableCellHeader = styled(Table.CellHeader)`
  padding-top: 0px;
`

const header = (
  <Table.Row>
    <StyledTableCellHeader>Date due</StyledTableCellHeader>
    <StyledTableCellHeader>Task title</StyledTableCellHeader>
    <StyledTableCellHeader>Company name</StyledTableCellHeader>
    <StyledTableCellHeader>Project</StyledTableCellHeader>
    <StyledTableCellHeader>Assigned to</StyledTableCellHeader>
    <StyledTableCellHeader>Status</StyledTableCellHeader>
  </Table.Row>
)

const rows = ({ results }) => {
  return results.map((task, index) => (
    <Table.Row key={`task_row_${index}`} data-test="task-item">
      <Table.Cell setWidth="12%">
        {task.due_date
          ? formatDate(task.due_date, DATE_FORMAT_MEDIUM)
          : task.dueDate
            ? formatDate(task.dueDate, DATE_FORMAT_MEDIUM)
            : ''}
      </Table.Cell>
      <Table.Cell setWidth="23%">
        <Link
          href={urls.tasks.details(task.id)}
          data-test={`${task.id}-task-link`}
        >
          {task.title}
        </Link>
      </Table.Cell>
      <Table.Cell setWidth="20%">{task.company?.name}</Table.Cell>
      <Table.Cell setWidth="20%">{task.investment_project?.name}</Table.Cell>
      <Table.Cell setWidth="15%">
        <ul>{transformAdvisersListItem(task.advisers)}</ul>
      </Table.Cell>
      <Table.Cell setWidth="10%">
        {task.archived
          ? 'Deleted'
          : task.status == STATUS.COMPLETED
            ? 'Completed'
            : 'Active'}
      </Table.Cell>
    </Table.Row>
  ))
}

const MyTasksTable = ({ myTasks }) => (
  <Table head={header} data-test="my-tasks-table">
    {rows(myTasks)}
  </Table>
)

export default MyTasksTable
