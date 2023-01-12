import urls from '../../../lib/urls'

export const ID = 'notificationAlertCount'
export const TASK_GET_NOTIFICATION_ALERT_COUNT =
  'TASK_GET_NOTIFICATION_ALERT_COUNT'

export const state2props = (state) => {
  const activeFeatureGroups = state.activeFeatureGroups
  const hasInvestmentFeatureGroup = activeFeatureGroups.includes(
    'investment-notifications'
  )
  const hasExportFeatureGroup = activeFeatureGroups.includes(
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
    hasFeatureGroup: hasInvestmentFeatureGroup || hasExportFeatureGroup,
  }
}
