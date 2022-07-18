import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link } from 'govuk-react'
import { BLACK } from 'govuk-colours'
import { SPACING, FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'
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

const Container = styled('div')({
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'flex',
  },
})

const MenuContainer = styled('div')({
  width: '100%',
  [MEDIA_QUERIES.DESKTOP]: {
    width: 'calc(33% - 20px)',
    padding: 10,
  },
})

const ListContainer = styled('div')({
  width: '100%',
  [MEDIA_QUERIES.DESKTOP]: {
    width: '67%',
  },
})

const SettingsLink = styled(Link)({
  display: 'block',
  marginTop: 30,
  marginBottom: 15,
  [MEDIA_QUERIES.TABLET]: {
    display: 'none',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'none',
  },
})

const Summary = styled('p')({
  color: BLACK,
  paddingTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_19,
})

const HomeLink = styled(Link)({
  display: 'block',
  marginTop: SPACING.SCALE_4,
  marginBottom: SPACING.SCALE_4,
  [MEDIA_QUERIES.DESKTOP]: {
    marginLeft: 25,
    marginBottom: 25,
  },
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
      <>
        <Container>
          <MenuContainer>
            <RemindersMenu />
            <SettingsLink
              data-test="reminders-settings-link"
              href="/reminders/settings"
            >
              Reminders settings
            </SettingsLink>
          </MenuContainer>
          <ListContainer>
            <CollectionHeader totalItems={count} />
            {results.length === 0 ? (
              <Summary data-test="no-reminders">You have no reminders.</Summary>
            ) : (
              <CollectionSort
                sortOptions={sortOptions}
                totalPages={totalPages}
              />
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
                        <RoutedPagination
                          initialPage={page}
                          items={count || 0}
                        />
                      </>
                    )
                  }}
                </Task>
              )}
            </Task.Status>
          </ListContainer>
        </Container>
        <HomeLink data-test="home-link" href={urls.dashboard()}>
          Home
        </HomeLink>
      </>
    </DefaultLayout>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(NoRecentInteractionReminders)
