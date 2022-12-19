export const ID = 'notificationAlertCount'
export const TASK_GET_NOTIFICATION_ALERT_COUNT =
  'TASK_GET_NOTIFICATION_ALERT_COUNT'

export const state2props = (state) => {
  const activeFeatureGroups = state?.activeFeatureGroups || []
  return {
    ...state[ID],
    hasFeatureGroup:
      activeFeatureGroups.includes('investment-notifications') ||
      activeFeatureGroups.includes('export-notifications'),
  }
}
