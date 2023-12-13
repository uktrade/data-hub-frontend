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

const TaskFormAdd = ({ currentAdviserId, task }) => {
  const { search } = useLocation()
  const searchParams = qs.parse(search.slice(1))

  const investmentProjectId = searchParams.investmentProjectId
  const investorCompanyName =
    task?.investmentProject?.investorCompany?.name || ''

  return (
    <DefaultLayout
      heading={`Add task for ${investorCompanyName}`}
      pageTitle={'Add Task'}
      breadcrumbs={[
        { link: urls.investments.index(), text: 'Investments' },
        { link: urls.investments.projects.index(), text: 'Projects' },
        {
          link: urls.investments.projects.details(task?.investmentProject?.id),
          text: task?.investmentProject?.name || '',
        },
        { text: `Add task for ${investorCompanyName}` },
      ]}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_INVESTMENT_PROJECT}
        id={INVESTMENT_PROJECT_ID}
        startOnRender={{
          payload: investmentProjectId,
          onSuccessDispatch: INVESTMENT__PROJECT_LOADED,
        }}
      >
        {() =>
          task && (
            <TaskFormFields
              task={task}
              currentAdviserId={currentAdviserId}
              analyticsFormName="createTaskForm"
              cancelRedirectUrl={urls.investments.projects.tasks.index(
                task?.investmentProject?.id
              )}
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

export default connect(state2props)(TaskFormAdd)
