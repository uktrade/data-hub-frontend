import React from 'react'
import { DefaultLayout, SummaryTable } from '../../../components'
import { useParams } from 'react-router-dom'

import { TaskResource } from '../../../components/Resource'
import { formatLongDate } from '../../../utils/date'
import { transformAdvisers, transformCompanyToLink } from './transformers'
import { buildCompanyBreadcrumbs } from '../../Companies/utils'

const TaskDetails = () => {
  // TODO MK: transform task.investmentProjectTask?.investmentProject?.investorCompany to company variable after loading TaskResource
  const { taskId } = useParams()

  return (
    <TaskResource id={taskId}>
      {(task) => (
        <DefaultLayout
          heading={task.title}
          pageTitle={task.title}
          breadcrumbs={buildCompanyBreadcrumbs(
            {
              text: `${task.title}`,
            },
            task.investmentProjectTask?.investmentProject?.investorCompany?.id,
            task.investmentProjectTask?.investmentProject?.investorCompany?.name
          )}
          useReactRouter={false}
        >
          <SummaryTable data-test="task-details-table">
            <SummaryTable.Row heading="Company">
              {transformCompanyToLink(
                task.investmentProjectTask?.investmentProject?.investorCompany
              )}
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
        </DefaultLayout>
      )}
    </TaskResource>
  )
}

export default TaskDetails
