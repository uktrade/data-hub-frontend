import axios from 'axios'

function handleError(error) {
  const message = error.response.data.detail
  return Promise.reject({
    message,
    ...error,
  })
}

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
