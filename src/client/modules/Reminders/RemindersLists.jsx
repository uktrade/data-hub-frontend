import React from 'react'
import { useLocation } from 'react-router-dom'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import qs from 'qs'

import { BLACK } from '../../../client/utils/colours'

import { ID } from './state'

import { sortOptions, maxItemsToPaginate, itemsPerPage } from './constants'

import { CollectionSort, RoutedPagination } from '../../components'
import CollectionHeader from './CollectionHeader'
import CollectionList from './CollectionList'
import Effect from '../../components/Effect'
import Task from '../../components/Task'

const Summary = styled('p')({
  color: BLACK,
  paddingTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_19,
})

const RemindersLists = ({
  reminders,
  pageOrigin,
  dataTest,
  getReminderTask,
  getReminderTaskOnSuccessDispatch,
  deleteReminderTask,
  deleteReminderTaskOnSuccessDispatch,
  getNextReminderTask,
  getNextReminderTaskOnSuccessDispatch,
  itemRenderer,
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
        <Summary data-test={dataTest}>You have no reminders.</Summary>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={getReminderTask}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch: getReminderTaskOnSuccessDispatch,
        }}
      >
        {() => (
          <Task>
            {(getTask) => {
              const deleteTask = getTask(deleteReminderTask, ID)
              const getNextTask = getTask(getNextReminderTask, ID)
              return (
                <>
                  <Effect
                    dependencyList={[nextPending]}
                    effect={() => {
                      if (nextPending) {
                        getNextTask.start({
                          payload: { page, sortby: qsParams.sortby },
                          onSuccessDispatch:
                            getNextReminderTaskOnSuccessDispatch,
                        })
                      }
                    }}
                  />
                  <CollectionList
                    results={results}
                    itemRenderer={itemRenderer}
                    disableDelete={deleteTask.status || nextPending}
                    onDeleteReminder={(reminderId) => {
                      deleteTask.start({
                        payload: { id: reminderId },
                        onSuccessDispatch: deleteReminderTaskOnSuccessDispatch,
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

export default RemindersLists
