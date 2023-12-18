import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SITE_WIDTH, SPACING } from '@govuk-react/constants'

import { HintText } from 'govuk-react'

import { GET_MY_TASKS_ID, TASK_GET_MY_TASKS, state2props } from './state'
import { MY_TASKS_LOADED } from '../../../actions'
import Task from '../../Task'
import ContentWithHeading from '../../ContentWithHeading'
import MyTasksTable from './MyTasksTable'
import TaskListSelect from './TaskListSelect'
import SpacedSectionBreak from '../../SpacedSectionBreak'

const SELECT_WIDTH = `16%`

const FiltersContainer = styled.div`
  display: grid;
  row-gap: 15px;
  column-gap: 2px;
  margin-bottom: ${SPACING.SCALE_3};

  grid-template-columns: repeat(2, ${SELECT_WIDTH}) 51.5% ${SELECT_WIDTH};
  @media (max-width: ${SITE_WIDTH}) {
    grid-template-columns: repeat(2, 50%);
    span.task-select-spacer {
      display: none;
    }
  }
`

export const MyTasksContent = ({ myTasks, filters }) => (
  <>
    <FiltersContainer>
      <TaskListSelect
        label="Assigned to"
        qsParam="assigned_to"
        options={filters?.assignedTo?.options}
      />
      <TaskListSelect
        label="Created by"
        qsParam="created_by"
        options={filters?.createdBy?.options}
      />
      <span class="task-select-spacer" id="task-select-spacer" />
      <TaskListSelect
        label="Sort by"
        qsParam="sortby"
        options={filters?.sortby?.options}
      />
    </FiltersContainer>
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
