import axios from 'axios'

import { catchApiError } from '../../../../../client/components/Task/utils'

export default (postcode) =>
  axios
    .get(`/api/postcode-to-region-lookup/${postcode}`)
    .catch(catchApiError)
    .then(({ data }) => data)

export const createCompany = ({ csrfToken, ...values }) => {
  const path = values.cannotFind ? 'company-investigation' : 'company-create'
  const postUrl = `/companies/create/dnb/${path}?_csrf=${csrfToken}`
  return axios
    .post(postUrl, values)
    .catch((err) => {
      return Promise.reject(err.response.data.error.message[0])
    })
    .then((response) => response.data)
}
