export const ID = 'reminders'
import { ID as REMINDER_SUMMARY_ID } from '../../components/NotificationAlert/state'
import urls from '../../../lib/urls'

// Investment lists
export const TASK_GET_ESTIMATED_LAND_DATE_REMINDERS =
  'TASK_GET_ESTIMATED_LAND_DATE_REMINDERS'
export const TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER =
  'TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER'
export const TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER =
  'TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER'

export const TASK_GET_NO_RECENT_INTERACTION_REMINDERS =
  'TASK_GET_NO_RECENT_INTERACTION_REMINDERS'
export const TASK_DELETE_NO_RECENT_INTERACTION_REMINDER =
  'TASK_DELETE_NO_RECENT_INTERACTION_REMINDER'
export const TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER =
  'TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER'

// Export lists
export const TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS =
  'TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS'
export const TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER =
  'TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER'
export const TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS =
  'TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS'

export const TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS =
  'TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS'
export const TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER =
  'TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER'
export const TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS =
  'TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS'

// Outstanding propositions list
export const TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS =
  'TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS'

// Summary
export const TASK_GET_SUBSCRIPTION_SUMMARY = 'TASK_GET_SUBSCRIPTION_SUMMARY'

// Investment subscriptions
export const TASK_GET_ELD_REMINDER_SUBSCRIPTIONS =
  'TASK_GET_ELD_REMINDER_SUBSCRIPTIONS'
export const TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS =
  'TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS'
export const TASK_GET_NRI_REMINDER_SUBSCRIPTIONS =
  'TASK_GET_NRI_REMINDER_SUBSCRIPTIONS'
export const TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS =
  'TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS'

// Exports subscriptions
export const TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS =
  'TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS'
export const TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS =
  'TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS'
export const TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS =
  'TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS'
export const TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS =
  'TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS'

// My tasks lists
export const TASK_GET_DUE_DATE_APPROACHING_REMINDERS =
  'TASK_GET_DUE_DATE_APPROACHING_REMINDERS'
export const TASK_DELETE_DUE_DATE_APPROACHING_REMINDER =
  'TASK_DELETE_DUE_DATE_APPROACHING_REMINDER'
export const TASK_GET_NEXT_DUE_DATE_APPROACHING_REMINDER =
  'TASK_GET_NEXT_DUE_DATE_APPROACHING_REMINDER'

// My task subscriptions
export const TASK_SAVE_MY_TASKS_DUE_DATE_APPROACHING_REMINDER_SUBSCRIPTIONS =
  'TASK_SAVE_MY_TASKS_DUE_DATE_APPROACHING_REMINDER_SUBSCRIPTIONS'

export const state2props = (state) => {
  const reminderSummary = state[REMINDER_SUMMARY_ID]
  const activeFeatureGroups = state.activeFeatureGroups
  const activeFeatures = state.activeFeatures

  const hasInvestmentFeatureGroup = activeFeatureGroups.includes(
    'investment-notifications'
  )
  const hasExportFeatureGroup = activeFeatureGroups.includes(
    'export-notifications'
  )

  const hasExportNewInteractionReminders = activeFeatures.includes(
    'export-new-interaction-reminders'
  )

  const defaultUrl =
    hasInvestmentFeatureGroup && hasExportFeatureGroup
      ? urls.reminders.investments.estimatedLandDate()
      : hasInvestmentFeatureGroup
      ? urls.reminders.investments.estimatedLandDate()
      : hasExportFeatureGroup
      ? urls.reminders.exports.noRecentInteractions()
      : urls.reminders.myTasks.dueDateApproaching()

  return {
    reminderSummary,
    hasInvestmentFeatureGroup,
    hasExportFeatureGroup,
    hasExportNewInteractionReminders,
    defaultUrl,
  }
}
