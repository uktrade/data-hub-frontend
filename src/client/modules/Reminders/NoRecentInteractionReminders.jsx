import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'
import { connect } from 'react-redux'

import {
  REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT,
} from '../../actions'
import Effect from '../../components/Effect'
import Task from '../../components/Task'

import RemindersCollection from './RemindersCollection'
import {
  ID,
  TASK_GET_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER,
  TASK_DELETE_NO_RECENT_INTERACTION_REMINDER,
} from './state'

const NoRecentInteractionReminders = ({ noRecentInteractionReminders }) => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const { results, count, nextPending } = noRecentInteractionReminders

  return (
    <Task.Status
      name={TASK_GET_NO_RECENT_INTERACTION_REMINDERS}
      id={ID}
      startOnRender={{
        payload: { page, sortby: qsParams.sortby },
        onSuccessDispatch: REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED,
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
                <RemindersCollection
                  subject="projects with no recent interaction"
                  results={results}
                  count={count}
                  page={page}
                  disableDelete={deleteTask.status || nextPending}
                  onDeleteReminder={(reminderId) => {
                    deleteTask.start({
                      payload: { id: reminderId },
                      onSuccessDispatch:
                        REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED,
                    })
                  }}
                />
              </>
            )
          }}
        </Task>
      )}
    </Task.Status>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(NoRecentInteractionReminders)
