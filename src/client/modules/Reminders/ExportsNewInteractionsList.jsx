import React from 'react'
import { connect } from 'react-redux'

import {
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS,
  TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER,
  TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS,
} from './state'

import RemindersLists from './RemindersLists'
import { ExportNewInteractionsItemRenderer } from './ItemRenderers/Exports/ExportNewInteractionsItemRenderer'

const ExportsNewInteractionsList = ({ reminders }) => {
  return (
    <RemindersLists
      reminders={reminders}
      pageOrigin="companies_new_interactions"
      dataTest="exports-new-reminders"
      getReminderTask={TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS}
      getReminderTaskOnSuccessDispatch={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED
      }
      deleteReminderTask={TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER}
      deleteReminderTaskOnSuccessDispatch={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED
      }
      getNextReminderTask={TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS}
      getNextReminderTaskOnSuccessDispatch={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT
      }
      itemRenderer={ExportNewInteractionsItemRenderer}
    />
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(ExportsNewInteractionsList)
