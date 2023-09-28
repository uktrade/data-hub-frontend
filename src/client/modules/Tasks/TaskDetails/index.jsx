import React, { useState } from 'react'
import { DefaultLayout, SummaryTable } from '../../../components'
import { useParams } from 'react-router-dom'

import { TaskResource } from '../../../components/Resource'
import { formatLongDate } from '../../../utils/date'
import { transformAdvisers, transformCompanyToLink } from './transformers'
import { buildCompanyBreadcrumbs } from '../../Companies/utils'

const getCompany = (task) => {
  return task.investmentProjectTask?.investmentProject?.investorCompany
}

const TaskDetails = () => {
  const { taskId } = useParams()

  const [task, setTask] = useState(undefined)
  const [company, setCompany] = useState(undefined)

  return (
    <DefaultLayout
      heading={task ? task.title : ''}
      pageTitle={task ? task.title : ''}
      breadcrumbs={buildCompanyBreadcrumbs(
        {
          text: task ? task.title : '',
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
        <SummaryTable data-test="task-details-table">
          <SummaryTable.Row heading="Company">
            {transformCompanyToLink(company)}
          </SummaryTable.Row>
          <SummaryTable.Row
            heading="Date due"
            children={formatLongDate(task.dueDate)}
          />
          <SummaryTable.Row
            heading="Assigned to"
            children={transformAdvisers(task.advisers)}
          />
          <SummaryTable.Row
            heading="Task description"
            children={task.description}
          />
          <SummaryTable.Row
            heading="Reminders set"
            children={`${task.reminderDays} days before due date`}
          />
          <SummaryTable.Row
            heading="Date created"
            children={formatLongDate(task.createdOn)}
          />
          <SummaryTable.Row
            heading="Created by"
            children={task.createdBy.name}
          />
        </SummaryTable>
      )}
    </DefaultLayout>
  )
}

export default TaskDetails
