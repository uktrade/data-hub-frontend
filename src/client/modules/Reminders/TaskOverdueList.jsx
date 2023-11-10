import React from 'react'
import { connect } from 'react-redux'

import {
  REMINDERS__TASK_OVERDUE_REMINDERS_DELETED,
  REMINDERS__TASK_OVERDUE_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_OVERDUE_REMINDERS_LOADED,
} from '../../actions'

import {
  ID,
  TASK_DELETE_TASK_OVERDUE_REMINDER,
  TASK_GET_TASK_OVERDUE_REMINDERS,
  TASK_GET_NEXT_TASK_OVERDUE_REMINDER,
} from './state'

import MyTasksItemRenderer from './ItemRenderers/Tasks/MyTasksItemRenderer'
import RemindersLists from './RemindersLists'

const MyTasksOverdueList = ({ reminders }) => (
  <RemindersLists
    reminders={reminders}
    pageOrigin="my_tasks_task_overdue"
    dataTest="my-tasks-no-reminders"
    getReminderTask={TASK_GET_TASK_OVERDUE_REMINDERS}
    getReminderTaskOnSuccessDispatch={REMINDERS__TASK_OVERDUE_REMINDERS_LOADED}
    deleteReminderTask={TASK_DELETE_TASK_OVERDUE_REMINDER}
    deleteReminderTaskOnSuccessDispatch={
      REMINDERS__TASK_OVERDUE_REMINDERS_DELETED
    }
    getNextReminderTask={TASK_GET_NEXT_TASK_OVERDUE_REMINDER}
    getNextReminderTaskOnSuccessDispatch={
      REMINDERS__TASK_OVERDUE_REMINDERS_GOT_NEXT
    }
    itemRenderer={MyTasksItemRenderer}
  />
)

export const state2props = (state) => state[ID]

export default connect(state2props)(MyTasksOverdueList)
