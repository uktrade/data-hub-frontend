import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import axios from 'axios'
import { NOT_IMPLEMENTED } from '../../exports/client/ExportWins/state'

export const getProjectsWon = ({ limit = 200, companyId }) => {
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      ...(companyId && {
        investor_company: [companyId],
      }),
    })
    .then(({ data }) => ({
      results: data.results,
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
