import axios from 'axios'

import { apiProxyAxios } from '../../../../components/Task/utils'

const NOT_IMPLEMENTED = 'notImplemented'

export const getProjectsWon = async ({ companyId }) => {
  return await apiProxyAxios
    .post('/v3/search/investment_project', {
      ...(companyId && {
        investor_company: [companyId],
        show_summary: true,
      }),
    })
    .then(({ data }) => ({
      results: data.results,
      summary: data.summary,
    }))
}
export const getLatestExportWins = ({ companyId, companyName, activePage }) => {
  const offset = activePage * 10 - 10
  const param = offset ? '?offset=' + offset : ''

  return axios
    .get(`/api-proxy/v4/company/${companyId}/export-win${param}`)
    .catch((e) => {
      if (e.response?.status === 501) {
        return { [NOT_IMPLEMENTED]: true }
      }

      if ([404, 500, 502].includes(e.response?.status)) {
        return Promise.reject(
          `We were unable to lookup Export Wins for ${companyName}, please try again later.`
        )
      }

      return Promise.reject(e.message)
    })

    .then(({ data }) => ({
      count: data.count,
      result: data.results[0],
    }))
}
