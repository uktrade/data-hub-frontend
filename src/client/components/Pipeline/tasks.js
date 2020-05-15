import axios from 'axios'

function handleError(e) {
  const message = e?.response?.data?.detail || 'An unknown error occured'
  return Promise.reject(new Error(message))
}

export function getPipelineList({ status }) {
  return axios
    .get('/api-proxy/v4/pipeline-item', {
      status,
    })
    .catch(handleError)
    .then(({ data }) => data.results)
}
