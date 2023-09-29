import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import qs from 'qs'

import { BLACK } from '../../../client/utils/colours'

import {
  REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_ESTIMATED_LAND_DATE_REMINDERS,
  TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER,
  TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER,
} from './state'

import { sortOptions, maxItemsToPaginate, itemsPerPage } from './constants'

import InvestmentItemRenderer from './ItemRenderers/InvestmentItemRenderer'
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

const InvestmentsEstimatedLandDatesList = ({ estimatedLandDateReminders }) => {
  const { results, count, nextPending } = estimatedLandDateReminders
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
        pageOrigin="investments_estimated_land_dates"
      />
      {results.length === 0 ? (
        <Summary data-test="investments-no-reminders">
          You have no reminders.
        </Summary>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch: REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
        }}
      >
        {() => (
          <Task>
            {(getTask) => {
              const deleteTask = getTask(
                TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER,
                ID
              )
              const getNextTask = getTask(
                TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER,
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
                          REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT,
                      })
                    }
                  />
                  <CollectionList
                    results={results}
                    itemRenderer={InvestmentItemRenderer}
                    disableDelete={deleteTask.status || nextPending}
                    onDeleteReminder={(reminderId) => {
                      deleteTask.start({
                        payload: { id: reminderId },
                        onSuccessDispatch:
                          REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
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

export default connect(state2props)(InvestmentsEstimatedLandDatesList)
