import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { TASK_SAVE_TASK_DETAILS, state2props } from './state'
import urls from '../../../../lib/urls'
import { ID as TASK_ID, TASK_GET_TASK_DETAILS } from '../TaskDetails/state'
import { TASK_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import { DefaultLayout } from '../../../components'

import TaskFormFields from './TaskFormFields'

const getTitle = (task) => {
  if (!task) {
    return 'Edit task'
  }
  if (!task.company) {
    return `Edit task for ${task.title}`
  }
  return `Edit task for ${task.company.label}`
}

const TaskFormEdit = ({
  currentAdviserId,
  task,
  breadcrumbs,
  companyInvestmentProjects,
}) => {
  const { taskId } = useParams()
  return (
    <DefaultLayout
      heading={getTitle(task)}
      pageTitle={'Edit Task'}
      breadcrumbs={breadcrumbs}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_TASK_DETAILS}
        id={TASK_ID}
        startOnRender={{
          payload: taskId,
          onSuccessDispatch: TASK_DETAILS_LOADED,
        }}
      >
        {() =>
          task && (
            <TaskFormFields
              currentAdviserId={currentAdviserId}
              task={task}
              analyticsFormName="editTaskForm"
              cancelRedirectUrl={urls.tasks.details(taskId)}
              redirectToUrl={urls.tasks.details(taskId)}
              submissionTaskName={TASK_SAVE_TASK_DETAILS}
              companyInvestmentProjects={companyInvestmentProjects}
            />
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskFormEdit)
