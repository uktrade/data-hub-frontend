import axios from 'axios'

function handleSuccess({ data }) {
  return data
}

function handleError(error) {
  const message = error?.response?.data?.detail || error.message
  return Promise.reject({
    message,
    ...error,
  })
}

export function getLargeCapitalProfiles({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0
  return axios
    .get('/api-proxy/v4/large-investor-profile', {
      params: {
        limit,
        offset,
        ...rest,
      },
    })
    .then(handleSuccess, handleError)
}
