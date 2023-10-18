import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import qs from 'qs'

import { BLACK } from '../../../client/utils/colours'

import { REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED } from '../../actions'

import { ID, TASK_GET_DUE_DATE_APPROACHING_REMINDERS } from './state'

import { sortOptions, maxItemsToPaginate, itemsPerPage } from './constants'

import MyTasksDueDateApproachingItemRenderer from './ItemRenderers/MyTasksDueDateApproachingItemRenderer'
import { CollectionSort, RoutedPagination } from '../../components'
import CollectionHeader from './CollectionHeader'
import CollectionList from './CollectionList'
import Task from '../../components/Task'

const Summary = styled('p')({
  color: BLACK,
  paddingTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_19,
})

const MyTasksDueDateApproachingList = ({ dueDateApproachingReminders }) => {
  const { results, count } = dueDateApproachingReminders
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
        pageOrigin="my_tasks_due_date_approaching"
      />
      {results.length === 0 ? (
        <Summary data-test="my-tasks-no-reminders">
          You have no reminders.
        </Summary>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={TASK_GET_DUE_DATE_APPROACHING_REMINDERS}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch: REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED,
        }}
      >
        {() => (
          <>
            <CollectionList
              results={results}
              itemRenderer={MyTasksDueDateApproachingItemRenderer}
            />
            <RoutedPagination initialPage={page} items={count || 0} />
          </>
        )}
      </Task.Status>
    </>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(MyTasksDueDateApproachingList)
