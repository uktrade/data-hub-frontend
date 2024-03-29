import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import styled from 'styled-components'

import { SPACING } from '@govuk-react/constants'

import { DefaultLayout, Tag } from '../../../components'
import TaskDetailsTable from './TaskDetailsTable'
import { ID, TASK_GET_TASK_DETAILS, state2props } from './state'
import { TASK_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import { STATUS } from '../TaskForm/constants'

const StyledTag = styled(Tag)`
  display: 'block',
  margin-bottom: ${SPACING.SCALE_2};
`

const TaskDetails = ({ task, breadcrumbs }) => {
  const { taskId } = useParams()
  const taskTitle = task ? task.title : ''
  const statusTag = task?.status == STATUS.COMPLETED && (
    <StyledTag colour="green" data-test="activity-kind-label">
      COMPLETED
    </StyledTag>
  )
  const archivedTag = task?.archived && (
    <StyledTag colour="red" data-test="activity-kind-label">
      DELETED
    </StyledTag>
  )
  const subheading =
    archivedTag || statusTag ? (
      <>
        {archivedTag} {statusTag}
      </>
    ) : (
      ''
    )

  return (
    <DefaultLayout
      heading={taskTitle}
      subheading={subheading}
      pageTitle={taskTitle}
      breadcrumbs={breadcrumbs}
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
        {() =>
          task && (
            <TaskDetailsTable
              task={task}
              company={task?.company}
              project={task?.investmentProject}
            />
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(TaskDetails)
