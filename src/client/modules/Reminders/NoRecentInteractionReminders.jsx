import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import qs from 'qs'

import {
  REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER,
  TASK_DELETE_NO_RECENT_INTERACTION_REMINDER,
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

const NoRecentInteractionReminders = ({ noRecentInteractionReminders }) => {
  const { results, count, nextPending } = noRecentInteractionReminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const subject = 'projects with no recent interaction'
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
            name={TASK_GET_NO_RECENT_INTERACTION_REMINDERS}
            id={ID}
            startOnRender={{
              payload: { page, sortby: qsParams.sortby },
              onSuccessDispatch:
                REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED,
            }}
          >
            {() => (
              <Task>
                {(getTask) => {
                  const deleteTask = getTask(
                    TASK_DELETE_NO_RECENT_INTERACTION_REMINDER,
                    ID
                  )
                  const getNextTask = getTask(
                    TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER,
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
                              REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT,
                          })
                        }
                      />
                      <CollectionList
                        results={results}
                        disableDelete={deleteTask.status || nextPending}
                        onDeleteReminder={(reminderId) => {
                          deleteTask.start({
                            payload: { id: reminderId },
                            onSuccessDispatch:
                              REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED,
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

export default connect(state2props)(NoRecentInteractionReminders)
