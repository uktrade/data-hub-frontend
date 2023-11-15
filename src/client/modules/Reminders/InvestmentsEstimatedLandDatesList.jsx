import React from 'react'
import { connect } from 'react-redux'

import {
  REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_ESTIMATED_LAND_DATE_REMINDERS,
  TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER,
  TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER,
} from './state'

import InvestmentItemRenderer from './ItemRenderers/Investments/InvestmentItemRenderer'
import RemindersLists from './RemindersLists'

const InvestmentsEstimatedLandDatesList = ({ reminders }) => {
  return (
    <RemindersLists
      reminders={reminders}
      pageOrigin="investments_estimated_land_dates"
      dataTest="investments-no-reminders"
      getReminderTask={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
      getReminderTaskOnSuccessDispatch={
        REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED
      }
      deleteReminderTask={TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER}
      deleteReminderTaskOnSuccessDispatch={
        REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED
      }
      getNextReminderTask={TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER}
      getNextReminderTaskOnSuccessDispatch={
        REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT
      }
      itemRenderer={InvestmentItemRenderer}
    />
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(InvestmentsEstimatedLandDatesList)
