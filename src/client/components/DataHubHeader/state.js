export const state2props = (state) => {
  const activeFeatureGroups = state.activeFeatureGroups
  const hasInvestmentFeatureGroup = activeFeatureGroups.includes(
    'investment-notifications'
  )
  const hasExportFeatureGroup = activeFeatureGroups.includes(
    'export-notifications'
  )

  const hasFeatureGroup = hasInvestmentFeatureGroup || hasExportFeatureGroup

  return {
    hasFeatureGroup,
  }
}
