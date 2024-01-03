import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'qs'

import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import {
  INVESTMENT_PROJECT_ID,
  TASK_GET_INVESTMENT_PROJECT,
} from '../../Investments/Projects/state'
import { INVESTMENT__PROJECT_LOADED } from '../../../actions'
import TaskFormFields from './TaskFormFields'
import urls from '../../../../lib/urls'
import { TASK_SAVE_TASK_DETAILS, state2props } from './state'

const getTitle = (task) => {
  if (!task) {
    return 'Add task'
  }
  if (task.investmentProject) {
    return `Add task for ${task.investmentProject.label}`
  }
  return `Add task for ${task.company}`
}

const getRedirectUrl = (task) => {
  if (!task) {
    return urls.dashboard.myTasks()
  }
  if (task.investmentProject) {
    return urls.investments.projects.tasks.index(task?.investmentProject?.value)
  }
  return urls.tasks.details(task.id)
}

const getCancelUrl = (task) => {
  if (!task) {
    return urls.dashboard.myTasks()
  }
  if (task.investmentProject) {
    return urls.investments.projects.tasks.index(task?.investmentProject?.value)
  }
  return urls.tasks.details(task.id)
}

const TaskFormAdd = ({ currentAdviserId, task, breadcrumbs }) => {
  const { search } = useLocation()
  const { investmentProjectId } = qs.parse(search.slice(1))
  const redirectUrl = getRedirectUrl(task)
  const cancelUrl = getCancelUrl(task)

  return (
    <DefaultLayout
      heading={getTitle(task)}
      pageTitle={'Add Task'}
      breadcrumbs={breadcrumbs}
      useReactRouter={false}
    >
      {investmentProjectId && (
        <Task.Status
          name={TASK_GET_INVESTMENT_PROJECT}
          id={INVESTMENT_PROJECT_ID}
          startOnRender={{
            payload: investmentProjectId,
            onSuccessDispatch: INVESTMENT__PROJECT_LOADED,
          }}
        ></Task.Status>
      )}

      <TaskFormFields
        task={task}
        currentAdviserId={currentAdviserId}
        analyticsFormName="createTaskForm"
        cancelRedirectUrl={cancelUrl}
        redirectToUrl={redirectUrl}
        submissionTaskName={TASK_SAVE_TASK_DETAILS}
      />
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskFormAdd)
