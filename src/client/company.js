import axios from 'axios'
import { apiProxyAxios } from './components/Task/utils'
import { castArray } from 'lodash'

export const getCompanyNames = (company) => {
  if (!company) {
    return []
  }

  const companies = castArray(company)

  return axios
    .all(
      companies.map((company) => apiProxyAxios.get(`/v4/company/${company}`))
    )
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          companies: data,
        }))
      )
    )
}
