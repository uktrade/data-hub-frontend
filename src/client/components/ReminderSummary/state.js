import { ID } from '../NotificationAlert/state'
import urls from '../../../lib/urls'

const transformReminderSummary = (data) => ({
  count: data.count,
  investment: [
    {
      name: 'Approaching estimated land dates',
      url: urls.reminders.investments.estimatedLandDate(),
      count: data.investment.estimated_land_date,
    },
    {
      name: 'Projects with no recent interactions',
      url: urls.reminders.investments.noRecentInteraction(),
      count: data.investment.no_recent_interaction,
    },
    {
      name: 'Outstanding propositions',
      url: urls.reminders.investments.outstandingPropositions(),
      count: data.investment.outstanding_propositions,
    },
  ],
  export: [
    {
      name: 'Companies with no recent interactions',
      url: urls.reminders.exports.noRecentInteractions(),
      count: data.export.no_recent_interaction,
    },
  ],
})

export const state2props = (state) => {
  const summary = transformReminderSummary(state[ID])
  const hasExportFeatureGroup = state.activeFeatureGroups.includes(
    'export-notifications'
  )
  const hasInvestmentFeatureGroup = state.activeFeatureGroups.includes(
    'investment-notifications'
  )

  return {
    summary,
    hasExportFeatureGroup,
    hasInvestmentFeatureGroup,
  }
}
