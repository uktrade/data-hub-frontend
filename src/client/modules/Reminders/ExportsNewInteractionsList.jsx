import React from 'react'
import { connect } from 'react-redux'

import ExportsList from './ExportsList'
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
import { ExportNewInteractionsItemRenderer } from './ItemRenderers/ExportNewInteractionsItemRenderer'

const ExportsNewInteractionsList = ({ exportsNewInteractionReminders }) => {
  return (
    <ExportsList
      reminders={exportsNewInteractionReminders}
      pageOrigin="companies_new_interactions"
      summaryDataTest="exports-new-reminders"
      taskStatusName={TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS}
      taskStatusSuccessFunction={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED
      }
      deleteTaskName={TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER}
      getNextTaskName={TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS}
      effectSuccessFunction={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT
      }
      deleteTaskSuccessFunction={
        REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED
      }
      itemRenderer={ExportNewInteractionsItemRenderer}
    />
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(ExportsNewInteractionsList)
