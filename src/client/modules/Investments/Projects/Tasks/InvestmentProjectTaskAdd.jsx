import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { TASK_SAVE_INVESTMENT_PROJECT_TASK, state2props } from './state'
import { INVESTMENT_PROJECT_ID, TASK_GET_INVESTMENT_PROJECT } from '../state'
import urls from '../../../../../lib/urls'
import { INVESTMENT__PROJECT_LOADED } from '../../../../actions'
import Task from '../../../../components/Task'
import { DefaultLayout } from '../../../../components'
import TaskForm from '../../../Tasks/TaskForm'

const TaskAdd = ({ currentAdviserId, investmentProject }) => {
  const { projectId } = useParams()
  const investorCompanyName = investmentProject?.investorCompany?.name || ''
  return (
    <DefaultLayout
      heading={`Add task for ${investorCompanyName}`}
      pageTitle={'Add Task'}
      breadcrumbs={[
        { link: urls.investments.index(), text: 'Investments' },
        { link: urls.investments.projects.index(), text: 'Projects' },
        {
          link: urls.investments.projects.details(investmentProject?.id),
          text: investmentProject?.name || '',
        },
        { text: `Add task for ${investorCompanyName}` },
      ]}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_INVESTMENT_PROJECT}
        id={INVESTMENT_PROJECT_ID}
        startOnRender={{
          payload: projectId,
          onSuccessDispatch: INVESTMENT__PROJECT_LOADED,
        }}
      >
        {() =>
          investmentProject && (
            <TaskForm
              currentAdviserId={currentAdviserId}
              analyticsFormName="createInvestmentTaskForm"
              cancelRedirectUrl={urls.investments.projects.tasks.index(
                investmentProject.id
              )}
              redirectToUrl={urls.investments.projects.tasks.index(
                investmentProject.id
              )}
              submissionTaskName={TASK_SAVE_INVESTMENT_PROJECT_TASK}
              additionalPayloadData={{ investmentProject: investmentProject }}
            />
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskAdd)
