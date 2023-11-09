import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import qs from 'qs'

import { BLACK } from '../../../client/utils/colours'

import {
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED,
} from '../../actions'

import {
  ID,
  TASK_DELETE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
  TASK_GET_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS,
  TASK_GET_NEXT_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
} from './state'

import { sortOptions, maxItemsToPaginate, itemsPerPage } from './constants'

import TaskAssignedToMeFromOthersItemRenderer from './ItemRenderers/TaskAssignedToMeFromOthersItemRenderer'
import { CollectionSort, RoutedPagination } from '../../components'
import CollectionHeader from './CollectionHeader'
import CollectionList from './CollectionList'
import Task from '../../components/Task'
import Effect from '../../components/Effect'

const Summary = styled('p')({
  color: BLACK,
  paddingTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_19,
})

const TaskAssignedToMeFromOthersList = ({
  taskAssignedToMeFromOthersReminders,
}) => {
  const { results, count, nextPending } = taskAssignedToMeFromOthersReminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <>
      <CollectionHeader
        totalItems={count}
        pageOrigin="task_assigned_to_me_from_others"
      />
      {results.length === 0 ? (
        <Summary data-test="my-tasks-no-reminders">
          You have no reminders.
        </Summary>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={TASK_GET_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch:
            REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED,
        }}
      >
        {() => (
          <Task>
            {(getTask) => {
              const deleteTask = getTask(
                TASK_DELETE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
                ID
              )
              const getNextTask = getTask(
                TASK_GET_NEXT_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
                ID
              )
              return (
                <>
                  <Effect
                    dependencyList={[nextPending]}
                    effect={() =>
                      nextPending &&
                      getNextTask.start({
                        payload: { page, sortby: qsParams.sortby },
                        onSuccessDispatch:
                          REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT,
                      })
                    }
                  />
                  <CollectionList
                    results={results}
                    itemRenderer={TaskAssignedToMeFromOthersItemRenderer}
                    disableDelete={deleteTask.status || nextPending}
                    onDeleteReminder={(reminderId) => {
                      deleteTask.start({
                        payload: { id: reminderId },
                        onSuccessDispatch:
                          REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED,
                      })
                    }}
                  />
                  <RoutedPagination initialPage={page} items={count || 0} />
                </>
              )
            }}
          </Task>
        )}
      </Task.Status>
    </>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(TaskAssignedToMeFromOthersList)
