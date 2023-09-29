import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { DefaultLayout } from '../../../components'
import { buildCompanyBreadcrumbs } from '../../Companies/utils'
import TaskDetailsTable from './TaskDetailsTable'
import { ID, TASK_GET_TASK_DETAILS, state2props } from './state'
import { TASK_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'

const getCompany = (task) => {
  return task?.investmentProjectTask?.investmentProject?.investorCompany
}

const TaskDetails = ({ task }) => {
  const { taskId } = useParams()

  const company = getCompany(task)
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
      <Task.Status
        name={TASK_GET_TASK_DETAILS}
        id={ID}
        startOnRender={{
          payload: taskId,
          onSuccessDispatch: TASK_DETAILS_LOADED,
        }}
      >
        {() => task && <TaskDetailsTable task={task} company={company} />}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskDetails)
