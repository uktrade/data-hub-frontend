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

const getBreadcrumbs = (task, companyName) => {
  const defaultBreadcrumbs = [
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.projects.index(), text: 'Projects' },
  ]
  if (task && task.investmentProject) {
    return [
      ...defaultBreadcrumbs,

      {
        link: urls.investments.projects.details(task.investmentProject.id),
        text: task.investmentProject.name,
      },
      { text: `Edit task for ${companyName}` },
    ]
  }
  return defaultBreadcrumbs
}

const TaskFormEdit = ({ currentAdviserId, task }) => {
  const { taskId } = useParams()

  const companyName = task?.company?.name || ''

  return (
    <DefaultLayout
      heading={`Edit task for ${companyName}`}
      pageTitle={'Edit Task'}
      breadcrumbs={getBreadcrumbs(task, companyName)}
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
              redirectToUrl={urls.investments.projects.tasks.index(
                task?.investmentProject?.id
              )}
              submissionTaskName={TASK_SAVE_TASK_DETAILS}
            />
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskFormEdit)
