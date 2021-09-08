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
