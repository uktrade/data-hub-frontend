import urls from '../../../lib/urls'

export const ID = 'reminderSummary'
export const TASK_GET_REMINDER_SUMMARY = 'TASK_GET_REMINDER_SUMMARY'

export const state2props = (state) => {
  const hasInvestmentFeatureGroup = state.activeFeatureGroups.includes(
    'investment-notifications'
  )
  const hasExportFeatureGroup = state.activeFeatureGroups.includes(
    'export-notifications'
  )
  const remindersURL =
    hasInvestmentFeatureGroup && hasExportFeatureGroup
      ? urls.reminders.investments.estimatedLandDate()
      : hasInvestmentFeatureGroup
      ? urls.reminders.investments.estimatedLandDate()
      : urls.reminders.exports.noRecentInteractions()

  return {
    ...state[ID],
    remindersURL,
  }
}
