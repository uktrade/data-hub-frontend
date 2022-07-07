import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import qs from 'qs'

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
import { DARK_GREY } from '../../utils/colors'
import CollectionHeader from './CollectionHeader'
import Effect from '../../components/Effect'
import Task from '../../components/Task'
import RemindersMenu from './RemindersMenu'
import CollectionList from './CollectionList'
import urls from '../../../lib/urls'
import Heading from './Heading'
import {
  CollectionSort,
  DefaultLayout,
  RoutedPagination,
} from '../../components'

const StyledDiv = styled('div')({
  fontSize: FONT_SIZE.SIZE_16,
  color: DARK_GREY,
  paddingTop: SPACING.SCALE_4,
  paddingBottom: SPACING.SCALE_3,
})

const EstimatedLandDateReminders = ({ estimatedLandDateReminders }) => {
  const { results, count, nextPending } = estimatedLandDateReminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const subject = 'approaching estimated land dates'
  const title = `Reminders for ${subject}`
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <DefaultLayout
      pageTitle={title}
      heading={<Heading preHeading="Reminders for">{subject}</Heading>}
      breadcrumbs={[{ link: urls.dashboard(), text: 'Home' }, { text: title }]}
    >
      <GridRow>
        <GridCol setWidth="one-third">
          <RemindersMenu />
        </GridCol>
        <GridCol>
          <CollectionHeader totalItems={count} />
          {results.length === 0 ? (
            <StyledDiv data-test="no-reminders">
              You have no reminders
            </StyledDiv>
          ) : (
            <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
          )}
          <Task.Status
            name={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
            id={ID}
            startOnRender={{
              payload: { page, sortby: qsParams.sortby },
              onSuccessDispatch:
                REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
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
                        disableDelete={nextPending}
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
        </GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(EstimatedLandDateReminders)
