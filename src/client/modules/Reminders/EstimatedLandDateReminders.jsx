import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'
import { connect } from 'react-redux'

import {
  REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
} from '../../actions'
import Task from '../../components/Task'

import RemindersCollection from './RemindersCollection'
import {
  ID,
  TASK_GET_ESTIMATED_LAND_DATE_REMINDERS,
  TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER,
} from './state'

const EstimatedLandDateReminders = ({ estimatedLandDateReminders }) => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10)
  const { results, count } = estimatedLandDateReminders
  return (
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
            return (
              <RemindersCollection
                subject="approaching estimated land dates"
                results={results}
                count={count}
                page={page}
                onDeleteReminder={(reminderId) => {
                  deleteTask.start({
                    payload: { id: reminderId },
                    onSuccessDispatch:
                      REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
                  })
                }}
              />
            )
          }}
        </Task>
      )}
    </Task.Status>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(EstimatedLandDateReminders)
