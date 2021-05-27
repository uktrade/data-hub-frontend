import axios from 'axios'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

function getCompanies({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return axios
    .post('/api-proxy/v4/search/company', {
      limit,
      offset,
      ...rest,
    })
    .then(({ data }) => data, handleError)
}

export { getCompanies }
