import React from 'react'
import { connect } from 'react-redux'

import {
  REMINDERS__DUE_DATE_APPROACHING_REMINDERS_DELETED,
  REMINDERS__DUE_DATE_APPROACHING_REMINDERS_GOT_NEXT,
  REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED,
} from '../../actions'

import {
  ID,
  TASK_DELETE_DUE_DATE_APPROACHING_REMINDER,
  TASK_GET_DUE_DATE_APPROACHING_REMINDERS,
  TASK_GET_NEXT_DUE_DATE_APPROACHING_REMINDER,
} from './state'

import MyTasksItemRenderer from './ItemRenderers/Tasks/MyTasksItemRenderer'
import RemindersLists from './RemindersLists'

const MyTasksDueDateApproachingList = ({ reminders }) => (
  <RemindersLists
    reminders={reminders}
    pageOrigin="my_tasks_due_date_approaching"
    dataTest="my-tasks-no-reminders"
    getReminderTask={TASK_GET_DUE_DATE_APPROACHING_REMINDERS}
    getReminderTaskOnSuccessDispatch={
      REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED
    }
    deleteReminderTask={TASK_DELETE_DUE_DATE_APPROACHING_REMINDER}
    deleteReminderTaskOnSuccessDispatch={
      REMINDERS__DUE_DATE_APPROACHING_REMINDERS_DELETED
    }
    getNextReminderTask={TASK_GET_NEXT_DUE_DATE_APPROACHING_REMINDER}
    getNextReminderTaskOnSuccessDispatch={
      REMINDERS__DUE_DATE_APPROACHING_REMINDERS_GOT_NEXT
    }
    itemRenderer={MyTasksItemRenderer}
  />
)

export const state2props = (state) => state[ID]

export default connect(state2props)(MyTasksDueDateApproachingList)
