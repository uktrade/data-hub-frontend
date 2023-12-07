import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { HintText, GridCol, GridRow } from 'govuk-react'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import ContentWithHeading from '../../ContentWithHeading'
import MyTasksTable from './MyTasksTable'
import TaskListSelect from './TaskListSelect'
import SpacedSectionBreak from '../../SpacedSectionBreak'

const StyledHeader = styled('header')({
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: `-${SPACING.SCALE_1} -${SPACING.SCALE_2}`,
  },
})

const StyledGridCol = styled(GridCol)({
  marginBottom: SPACING.SCALE_3,
  paddingBottom: SPACING.SCALE_3,
  paddingLeft: '25px',
})

export const MyTasksContent = ({ myTasks, filters }) => (
  <>
    <StyledHeader>
      <GridRow>
        <StyledGridCol>
          <TaskListSelect
            label="Created by"
            qsParam="created_by"
            options={filters.createdBy.options}
          />
        </StyledGridCol>
      </GridRow>
    </StyledHeader>
    <SpacedSectionBreak />
    <ContentWithHeading
      heading={`${myTasks?.count} ${myTasks?.count == 1 ? 'task' : 'tasks'}`}
      data-test="my-tasks-heading"
    >
      {myTasks?.count ? (
        <MyTasksTable myTasks={myTasks} />
      ) : (
        <HintText>You do not have any tasks at this time.</HintText>
      )}
    </ContentWithHeading>
  </>
)
const MyTasks = ({ myTasks, filters, payload }) => (
  <Task.Status
    name={TASK_GET_MY_TASKS}
    id={GET_MY_TASKS_ID}
    progressMessage="Loading your tasks"
    startOnRender={{
      payload: payload,
      onSuccessDispatch: MY_TASKS_LOADED,
    }}
  >
    {() => <MyTasksContent myTasks={myTasks} filters={filters} />}
  </Task.Status>
)

export default connect(state2props)(MyTasks)
