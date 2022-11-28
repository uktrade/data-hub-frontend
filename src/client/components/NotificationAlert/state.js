export const ID = 'notificationAlertCount'
export const TASK_GET_NOTIFICATION_ALERT_COUNT =
  'TASK_GET_NOTIFICATION_ALERT_COUNT'

export const state2props = (state) => {
  //TODO: Implements get feature flag here
  return { ...state[ID], isFeatureFlagOn: true }
}
