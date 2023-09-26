import React from 'react'
import { DefaultLayout, SummaryTable } from '../../../components'
import { useParams } from 'react-router-dom'

import { TaskResource } from '../../../components/Resource'
import { formatLongDate } from '../../../utils/date'
import { transformAdvisers } from './transformers'

const TaskDetails = () => {
  const { taskId } = useParams()

  return (
    <TaskResource id={taskId}>
      {(task) => (
        <DefaultLayout
          heading={task.title}
          pageTitle={task.title}
          breadcrumbs={[]}
          useReactRouter={false}
        >
          <SummaryTable data-test="task-details-table">
            <SummaryTable.Row heading="Company" children="n/a" />
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
