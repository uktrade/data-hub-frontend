import React from 'react'
import { connect } from 'react-redux'

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

import InvestmentItemRenderer from './ItemRenderers/Investments/InvestmentItemRenderer'
import RemindersLists from './RemindersLists'

const InvestmentsNoRecentInteractionsList = ({ reminders }) => {
  return (
    <RemindersLists
      reminders={reminders}
      pageOrigin="investments_no_recent_interactions"
      dataTest="investments-no-reminders"
      getReminderTask={TASK_GET_NO_RECENT_INTERACTION_REMINDERS}
      getReminderTaskOnSuccessDispatch={
        REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED
      }
      deleteReminderTask={TASK_DELETE_NO_RECENT_INTERACTION_REMINDER}
      deleteReminderTaskOnSuccessDispatch={
        REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED
      }
      getNextReminderTask={TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER}
      getNextReminderTaskOnSuccessDispatch={
        REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT
      }
      itemRenderer={InvestmentItemRenderer}
    />
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(InvestmentsNoRecentInteractionsList)
