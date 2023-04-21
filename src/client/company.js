import axios from 'axios'
import { apiProxyAxios } from './components/Task/utils'

export const getCompanyNames = (company) => {
  if (!company) {
    return []
  }

  const companies = Array.isArray(company) ? company : [company]

  return axios
    .all(
      companies.map((companyId) =>
        apiProxyAxios.get(`/v4/company/${companyId}`)
      )
    )
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          companies: data[0],
        }))
      )
    )
}
