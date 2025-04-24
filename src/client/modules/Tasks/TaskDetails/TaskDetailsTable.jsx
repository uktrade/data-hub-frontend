import React from 'react'

import { SummaryTable } from '../../../components'

import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import { transformAdvisers } from './transformers'
import { NOT_SET_TEXT } from '../../../../apps/companies/constants'
import urls from '../../../../lib/urls'
import TaskButtons from './TaskButtons'
import AccessibleLink from '../../../components/Link'

const TaskDetailsTable = ({ task, company, project }) => (
  <>
    <SummaryTable data-test="task-details-table">
      <SummaryTable.Row
        heading="Company"
        children={
          company ? (
            <AccessibleLink href={urls.companies.detail(company.id)}>
              {company.name}
            </AccessibleLink>
          ) : (
            NOT_SET_TEXT
          )
        }
      />
      {project && (
        <SummaryTable.Row
          heading="Investment project"
          children={
            <AccessibleLink
              href={urls.investments.projects.details(project.id)}
            >
              {project.name}
            </AccessibleLink>
          }
        />
      )}
      {task.interaction && (
        <SummaryTable.Row
          heading="Related interaction"
          children={
            <AccessibleLink
              href={urls.interactions.detail(task.interaction.id)}
            >
              {task.interaction.subject}
            </AccessibleLink>
          }
        />
      )}
      <SummaryTable.Row
        heading="Date due"
        children={
          task.dueDate
            ? formatDate(task.dueDate, DATE_FORMAT_FULL)
            : NOT_SET_TEXT
        }
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
        children={formatDate(task.createdOn, DATE_FORMAT_FULL)}
      />
      <SummaryTable.Row heading="Created by" children={task.createdBy.name} />
    </SummaryTable>
    <TaskButtons task={task} />
  </>
)

export default TaskDetailsTable
