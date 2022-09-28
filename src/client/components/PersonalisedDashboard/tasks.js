import { apiProxyAxios } from '../Task/utils'
import { summaryToDataRange } from '../MyInvestmentProjects/transformers'

export const checkForInvestments = ({ adviser }) =>
  apiProxyAxios
    .post('/v3/search/investment_project', {
      limit: 1,
      adviser: adviser.id,
      show_summary: true,
    })
    .then(({ data: { summary, results } }) => ({
      summary: summaryToDataRange({ summary, adviser }),
      hasInvestmentProjects: !!results.length,
    }))

// This API call doesn't go through the conventional /api-proxy endpoint.
// Instead, it goes through a another piece of middleware where the path
// also starts with /api-proxy and requires the env var HELP_CENTRE_API_FEED
// to be set. The middleware can be found in help-centre-api-proxy.js
export const checkDataHubFeed = () =>
  apiProxyAxios.get('/api-proxy/help-centre/feed').then(({ data }) => ({
    dataHubFeed: data,
  }))
