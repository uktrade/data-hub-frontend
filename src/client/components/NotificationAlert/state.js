export const ID = 'notificationAlertCount'
export const TASK_GET_NOTIFICATION_ALERT_COUNT =
  'TASK_GET_NOTIFICATION_ALERT_COUNT'

export const state2props = (state) => {
  const activeFeatures = state?.adviser?.active_features || []
  const hasFeatureFlag = activeFeatures.includes('reminder-summary')
  return {
    ...state[ID],
    hasFeatureFlag,
  }
}
