import React, { useState } from 'react'
import { DefaultLayout, SummaryTable } from '../../../components'
import { useParams } from 'react-router-dom'

import { Link } from 'govuk-react'

import { TaskResource } from '../../../components/Resource'
import { formatLongDate } from '../../../utils/date'
import { transformAdvisers } from './transformers'
import { buildCompanyBreadcrumbs } from '../../Companies/utils'
import { NOT_SET_TEXT } from '../../../../apps/companies/constants'
import urls from '../../../../lib/urls'

const getCompany = (task) => {
  return task.investmentProjectTask?.investmentProject?.investorCompany
}

export const TaskDetailsTable = ({ task, company }) => (
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
)

const TaskDetails = () => {
  const { taskId } = useParams()

  const [task, setTask] = useState(undefined)
  const [company, setCompany] = useState(undefined)
  const taskTitle = task ? task.title : ''

  return (
    <DefaultLayout
      heading={taskTitle}
      pageTitle={taskTitle}
      breadcrumbs={buildCompanyBreadcrumbs(
        {
          text: taskTitle,
        },
        company?.id,
        company?.name
      )}
      useReactRouter={false}
    >
      {!task ? (
        <TaskResource id={taskId}>
          {(taskResource) => {
            setTask(taskResource)
            setCompany(getCompany(taskResource))
          }}
        </TaskResource>
      ) : (
        <TaskDetailsTable task={task} company={company} />
      )}
    </DefaultLayout>
  )
}

export default TaskDetails
