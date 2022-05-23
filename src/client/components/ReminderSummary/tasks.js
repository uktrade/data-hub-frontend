import { apiProxyAxios } from '../Task/utils'

export const fetchReminderSummary = () =>
  apiProxyAxios.get('/v4/reminder/summary').then(({ data }) => data)
