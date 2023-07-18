import { apiProxyAxios } from './components/Task/utils'
import { castArray } from 'lodash'

export const getCompanyNames = (company) => {
  if (!company) {
    return []
  }

  const companies = castArray(company)

  return apiProxyAxios
    .post('/v4/search/company', { id: companies })
    .then(({ data }) => data.results)
}
