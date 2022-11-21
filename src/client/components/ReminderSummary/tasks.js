import { apiProxyAxios } from '../Task/utils'
import urls from '../../../lib/urls'

const transformSummaryData = ({ data }) => ({
  count: data.count,
  investment: [
    {
      name: 'Approaching estimated land dates',
      url: urls.reminders.estimatedLandDate(),
      count: data.investment.estimated_land_date,
    },
    {
      name: 'Projects with no recent interaction',
      url: urls.reminders.noRecentInteraction(),
      count: data.investment.no_recent_interaction,
    },
    {
      name: 'Outstanding propositions',
      url: urls.reminders.outstandingPropositions(),
      count: data.investment.outstanding_propositions,
    },
  ],
})

export const fetchReminderSummary = () =>
  apiProxyAxios.get('/v4/reminder/summary').then(transformSummaryData)
