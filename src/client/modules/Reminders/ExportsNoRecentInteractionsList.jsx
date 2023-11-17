import React from 'react'
import { connect } from 'react-redux'

import {
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
  TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER,
} from './state'

import RemindersLists from './RemindersLists'
import { ExportNoRecentInteractionsItemRenderer } from './ItemRenderers/Exports/ExportNoRecentInteractionsItemRenderer'

const ExportsNoRecentInteractionsList = ({ reminders }) => {
  return (
    <RemindersLists
      reminders={reminders}
      pageOrigin="companies_no_recent_interactions"
      dataTest="investments-no-reminders"
      getReminderTask={TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS}
      getReminderTaskOnSuccessDispatch={
        REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED
      }
      deleteReminderTask={TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER}
      deleteReminderTaskOnSuccessDispatch={
        REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED
      }
      getNextReminderTask={
        TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS
      }
      getNextReminderTaskOnSuccessDispatch={
        REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT
      }
      itemRenderer={ExportNoRecentInteractionsItemRenderer}
    />
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(ExportsNoRecentInteractionsList)
