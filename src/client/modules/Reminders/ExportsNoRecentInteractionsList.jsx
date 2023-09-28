import React from 'react'
import { connect } from 'react-redux'

import ExportsList from './ExportsList'
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
import { ExportNoRecentInteractionsItemRenderer } from './ItemRenderers/ExportNoRecentInteractionsItemRenderer'

const ExportsNoRecentInteractionsList = ({
  exportsNoRecentInteractionReminders,
}) => {
  return (
    <ExportsList
      reminders={exportsNoRecentInteractionReminders}
      pageOrigin="companies_no_recent_interactions"
      summaryDataTest="investments-no-reminders"
      taskStatusName={TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS}
      taskStatusSuccessFunction={
        REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED
      }
      deleteTaskName={TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER}
      getNextTaskName={TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS}
      effectSuccessFunction={
        REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT
      }
      deleteTaskSuccessFunction={
        REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED
      }
      itemRenderer={ExportNoRecentInteractionsItemRenderer}
    />
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(ExportsNoRecentInteractionsList)
