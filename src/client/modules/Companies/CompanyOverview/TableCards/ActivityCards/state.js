export const TASK_GET_COMPANY_OVERVIEW_ACTIVITY =
  'TASK_GET_COMPANY_OVERVIEW_ACTIVITY'
export const OVERVIEW_RECENT_ACTIVITY_ID = 'overviewRecentActivity'
export const OVERVIEW_UPCOMING_ACTIVITY_ID = 'overviewUpcomingActivity'

export const recentState2props = (state) => state[OVERVIEW_RECENT_ACTIVITY_ID]
export const upcomingState2props = (state) =>
  state[OVERVIEW_UPCOMING_ACTIVITY_ID]
