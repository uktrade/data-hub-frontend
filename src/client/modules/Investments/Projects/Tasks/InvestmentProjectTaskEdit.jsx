import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { state2props } from './state'

import urls from '../../../../../lib/urls'
import Task from '../../../../components/Task'
import InvestmentProjectTaskForm from './InvestmentProjectTaskForm'
import {
  ID as TASK_ID,
  TASK_GET_TASK_DETAILS,
} from '../../../Tasks/TaskDetails/state'
import { TASK_DETAILS_LOADED } from '../../../../actions'
import { DefaultLayout } from '../../../../components'

const TaskEdit = ({ currentAdviserId, task }) => {
  const { taskId } = useParams()
  const investmentProject = task?.investmentProject
  const investorCompanyName = investmentProject?.investorCompany.name || ''
  return (
    <DefaultLayout
      heading={`Edit task for ${investorCompanyName}`}
      pageTitle={'Edit Task'}
      breadcrumbs={[
        { link: urls.investments.index(), text: 'Investments' },
        { link: urls.investments.projects.index(), text: 'Projects' },
        {
          link: urls.investments.projects.details(investmentProject?.id),
          text: investmentProject?.name,
        },
        { text: `Edit task for ${investorCompanyName}` },
      ]}
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
        {() => (
          <InvestmentProjectTaskForm
            investmentProject={investmentProject}
            currentAdviserId={currentAdviserId}
            task={task}
          />
        )}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskEdit)
