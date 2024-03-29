import { apiProxyAxios } from '../Task/utils'

import { summaryToDataRange } from './transformers'

export const fetchMyInvestmentsList = ({
  limit = 10,
  page = 1,
  adviser,
  sort,
  stage,
  status,
  landDate,
}) => {
  const payload = {
    limit,
    // API is limited to a maximum of 10,000 results
    offset: Math.min(limit * (page - 1), 10000 - limit) || 0,
    adviser: adviser.id,
    sortby: sort,
    show_summary: true,
  }

  if (stage !== 'all-stages') {
    payload.stage = stage
  }
  if (status !== 'all-statuses') {
    payload.status = status
  }
  if (landDate !== 'all-land-dates') {
    payload.land_date_financial_year_start = [landDate]
  }

  return apiProxyAxios
    .post('/v3/search/investment_project', payload)
    .then(({ data: { summary, ...rest } }) => ({
      summary: summaryToDataRange({
        summary,
        adviser,
        status,
        landDate,
      }),
      ...rest,
    }))
}
