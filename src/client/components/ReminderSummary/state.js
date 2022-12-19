export const ID = 'reminderSummary'
export const TASK_GET_REMINDER_SUMMARY = 'TASK_GET_REMINDER_SUMMARY'
export const state2props = (state) => {
  const activeFeatureGroups = state?.activeFeatureGroups || []
  const hasExportFeatureGroup = activeFeatureGroups.includes(
    'export-notifications'
  )
  const hasInvestmentFeatureGroup = activeFeatureGroups.includes(
    'investment-notifications'
  )
  return {
    summary: state[ID],
    hasExportFeatureGroup,
    hasInvestmentFeatureGroup,
  }
}
