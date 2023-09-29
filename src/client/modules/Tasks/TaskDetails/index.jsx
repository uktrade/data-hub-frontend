import React, { useState } from 'react'
import { DefaultLayout } from '../../../components'
import { useParams } from 'react-router-dom'

import { TaskResource } from '../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../../Companies/utils'
import TaskDetailsTable from './TaskDetailsTable'

const getCompany = (task) => {
  return task.investmentProjectTask?.investmentProject?.investorCompany
}

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
