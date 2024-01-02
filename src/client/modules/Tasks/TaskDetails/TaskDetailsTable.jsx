import React from 'react'
import { Link } from 'govuk-react'

import { SummaryTable } from '../../../components'

import { formatLongDate } from '../../../utils/date'
import { transformAdvisers } from './transformers'
import { NOT_SET_TEXT } from '../../../../apps/companies/constants'
import urls from '../../../../lib/urls'
import TaskButtons from './TaskButtons'

const TaskDetailsTable = ({ task, company, project }) => (
  <>
    <SummaryTable data-test="task-details-table">
      <SummaryTable.Row
        heading="Company"
        children={
          company ? (
            <Link href={urls.companies.detail(company.id)}>{company.name}</Link>
          ) : (
            NOT_SET_TEXT
          )
        }
      />
      {project && (
        <SummaryTable.Row
          heading="Investment project"
          children={
            <Link href={urls.investments.projects.details(project.id)}>
              {project.name}
            </Link>
          }
        />
      )}
      <SummaryTable.Row
        heading="Date due"
        children={task.dueDate ? formatLongDate(task.dueDate) : NOT_SET_TEXT}
      />
      <SummaryTable.Row
        heading="Assigned to"
        children={transformAdvisers(task.advisers)}
      />
      <SummaryTable.Row
        heading="Task description"
        children={task.description || NOT_SET_TEXT}
      />
      <SummaryTable.Row
        heading="Reminders set"
        children={
          task.emailRemindersEnabled
            ? `${task.reminderDays} days before due date`
            : NOT_SET_TEXT
        }
      />
      <SummaryTable.Row
        heading="Date created"
        children={formatLongDate(task.createdOn)}
      />
      <SummaryTable.Row heading="Created by" children={task.createdBy.name} />
    </SummaryTable>
    <TaskButtons task={task} />
  </>
)

export default TaskDetailsTable
