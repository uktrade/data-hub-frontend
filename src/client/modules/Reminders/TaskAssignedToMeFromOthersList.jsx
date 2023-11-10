import React from 'react'
import { connect } from 'react-redux'

import {
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED,
} from '../../actions'

import {
  ID,
  TASK_DELETE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
  TASK_GET_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS,
  TASK_GET_NEXT_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
} from './state'

import TaskAssignedToMeFromOthersItemRenderer from './ItemRenderers/TaskAssignedToMeFromOthersItemRenderer'
import RemindersLists from './RemindersLists'

const TaskAssignedToMeFromOthersList = ({ reminders }) => (
  <RemindersLists
    reminders={reminders}
    pageOrigin="task_assigned_to_me_from_others"
    dataTest="my-tasks-no-reminders"
    getReminderTask={TASK_GET_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS}
    getReminderTaskOnSuccessDispatch={
      REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED
    }
    deleteReminderTask={TASK_DELETE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER}
    deleteReminderTaskOnSuccessDispatch={
      REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED
    }
    getNextReminderTask={TASK_GET_NEXT_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER}
    getNextReminderTaskOnSuccessDispatch={
      REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT
    }
    itemRenderer={TaskAssignedToMeFromOthersItemRenderer}
  />
)

export const state2props = (state) => state[ID]

export default connect(state2props)(TaskAssignedToMeFromOthersList)
