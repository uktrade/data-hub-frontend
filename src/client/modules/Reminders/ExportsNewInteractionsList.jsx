import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { BLACK } from 'govuk-colours'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import qs from 'qs'

import {
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS,
  TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER,
  TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS,
} from './state'

import { sortOptions, maxItemsToPaginate, itemsPerPage } from './constants'

import { CollectionSort, RoutedPagination } from '../../components'
import ExportItemRenderer from './ItemRenderers/ExportItemRenderer'
import CollectionHeader from './CollectionHeader'
import CollectionList from './CollectionList'
import Effect from '../../components/Effect'
import Task from '../../components/Task'

const Summary = styled('p')({
  color: BLACK,
  paddingTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_19,
})

const ExportsList = ({
  reminders,
  pageOrigin,
  summaryDataTest,
  taskStatusName,
  taskStatusSuccessFunction,
  deleteTaskName,
  getNextTaskName,
  effectSuccessFunction,
  deleteTaskSuccessFunction,
}) => {
  const { results, count, nextPending } = reminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <>
      <CollectionHeader totalItems={count} pageOrigin={pageOrigin} />
      {results.length === 0 ? (
        <Summary data-test={summaryDataTest}>You have no reminders.</Summary>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={taskStatusName}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch: taskStatusSuccessFunction,
        }}
      >
        {() => (
          <Task>
            {(getTask) => {
              const deleteTask = getTask(deleteTaskName, ID)
              const getNextTask = getTask(getNextTaskName, ID)
              return (
                <>
                  <Effect
                    dependencyList={[nextPending]}
                    effect={() =>
                      nextPending &&
                      getNextTask.start({
                        payload: {
                          page,
                          sortby: qsParams.sortby,
                        },
                        onSuccessDispatch: effectSuccessFunction,
                      })
                    }
                  />
                  <CollectionList
                    results={results}
                    itemRenderer={ExportItemRenderer}
                    disableDelete={deleteTask.status || nextPending}
                    onDeleteReminder={(reminderId) => {
                      deleteTask.start({
                        payload: { id: reminderId },
                        onSuccessDispatch: deleteTaskSuccessFunction,
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

const ExportsNewInteractionsList = ({ exportsNewInteractionReminders }) => {
  return (
    <ExportsList
      reminders={exportsNewInteractionReminders}
      pageOrigin="companies_new_interactions"
      summaryDataTest="exports-new-reminders"
      taskStatusName={TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS}
      taskStatusSuccessFunction={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED
      }
      deleteTaskName={TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER}
      getNextTaskName={TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS}
      effectSuccessFunction={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT
      }
      deleteTaskSuccessFunction={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED
      }
    />
  )

  const { results, count, nextPending } = exportsNewInteractionReminders
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
        pageOrigin="companies_new_interactions"
      />
      {results.length === 0 ? (
        <Summary data-test="exports-new-reminders">
          You have no reminders.
        </Summary>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch:
            REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED,
        }}
      >
        {() => (
          <Task>
            {(getTask) => {
              const deleteTask = getTask(
                TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER,
                ID
              )
              const getNextTask = getTask(
                TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS,
                ID
              )
              return (
                <>
                  <Effect
                    dependencyList={[nextPending]}
                    effect={() =>
                      nextPending &&
                      getNextTask.start({
                        payload: {
                          page,
                          sortby: qsParams.sortby,
                        },
                        onSuccessDispatch:
                          REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT,
                      })
                    }
                  />
                  <CollectionList
                    results={results}
                    itemRenderer={ExportItemRenderer}
                    disableDelete={deleteTask.status || nextPending}
                    onDeleteReminder={(reminderId) => {
                      deleteTask.start({
                        payload: { id: reminderId },
                        onSuccessDispatch:
                          REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED,
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

export default connect(state2props)(ExportsNewInteractionsList)
