import axios from 'axios'

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
