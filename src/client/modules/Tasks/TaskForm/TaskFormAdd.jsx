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
import {
  INTERACTION__LOADED,
  INVESTMENT__PROJECT_LOADED,
  COPY_TASK_DETAILS_LOADED,
} from '../../../actions'
import TaskFormFields from './TaskFormFields'
import urls from '../../../../lib/urls'
import { TASK_SAVE_TASK_DETAILS, state2props } from './state'
import {
  TASK_GET_INTERACTION,
  ID as INTERACTION_ID,
} from '../../Interactions/InteractionDetails/state'
import { TASK_GET_TASK_DETAILS, ID as TASK_ID } from '../TaskDetails/state'

const getTitle = (task) => {
  if (!task) {
    return 'Add task'
  }
  if (task.investmentProject) {
    return `Add task for ${task.investmentProject.label}`
  }
  if (task.interaction) {
    return `Add task for ${task.interaction.subject}`
  }
  if (task.company) {
    return `Add task for ${task.company.label}`
  }
  return `Add task`
}

const getRedirectUrl = (task) => {
  if (!task) {
    return urls.dashboard.myTasks()
  }
  if (task.interaction) {
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
  if (task.interaction) {
    return urls.dashboard.myTasks()
  }
  if (task.investmentProject) {
    return urls.investments.projects.tasks.index(task?.investmentProject?.value)
  }
  return urls.tasks.details(task.id)
}

const TaskForm = ({ task, currentAdviserId, companyInvestmentProjects }) => {
  const redirectUrl = getRedirectUrl(task)
  const cancelUrl = getCancelUrl(task)
  return (
    <TaskFormFields
      task={task}
      currentAdviserId={currentAdviserId}
      analyticsFormName="createTaskForm"
      cancelRedirectUrl={cancelUrl}
      redirectToUrl={redirectUrl}
      submissionTaskName={TASK_SAVE_TASK_DETAILS}
      companyInvestmentProjects={companyInvestmentProjects}
    />
  )
}

const getTaskProps = (investmentProjectId, interactionId, copyTaskId) => {
  if (investmentProjectId) {
    return {
      name: TASK_GET_INVESTMENT_PROJECT,
      id: INVESTMENT_PROJECT_ID,
      startOnRender: {
        payload: investmentProjectId,
        onSuccessDispatch: INVESTMENT__PROJECT_LOADED,
      },
    }
  }
  if (interactionId) {
    return {
      name: TASK_GET_INTERACTION,
      id: INTERACTION_ID,
      startOnRender: {
        payload: interactionId,
        onSuccessDispatch: INTERACTION__LOADED,
      },
    }
  }
  if (copyTaskId) {
    return {
      name: TASK_GET_TASK_DETAILS,
      id: TASK_ID,
      startOnRender: {
        payload: copyTaskId,
        onSuccessDispatch: COPY_TASK_DETAILS_LOADED,
      },
    }
  }
}

const TaskFormAdd = ({
  currentAdviserId,
  task,
  breadcrumbs,
  companyInvestmentProjects,
}) => {
  const { search } = useLocation()
  const { investmentProjectId, interactionId, copyTaskId } = qs.parse(
    search.slice(1)
  )
  const taskForm = (
    <TaskForm
      task={task}
      currentAdviserId={currentAdviserId}
      companyInvestmentProjects={companyInvestmentProjects}
    />
  )

  return (
    <DefaultLayout
      heading={getTitle(task)}
      pageTitle={'Add Task'}
      breadcrumbs={breadcrumbs}
      useReactRouter={false}
    >
      {investmentProjectId || interactionId || copyTaskId ? (
        <Task.Status
          {...getTaskProps(investmentProjectId, interactionId, copyTaskId)}
        >
          {() => taskForm}
        </Task.Status>
      ) : (
        taskForm
      )}
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskFormAdd)
