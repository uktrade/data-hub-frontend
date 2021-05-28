import axios from 'axios'
import { transformResponseToCompanyCollection } from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

function getCompanies({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return axios
    .post('/api-proxy/v4/search/company', {
      limit,
      offset,
      ...rest,
    })
    .then(({ data }) => transformResponseToCompanyCollection(data), handleError)
}

export { getCompanies }
