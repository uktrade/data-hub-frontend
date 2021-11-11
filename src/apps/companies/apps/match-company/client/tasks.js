import axios from 'axios'
import urls from '../../../../../lib/urls'

export const onMatchSubmit = ({ csrfToken, company, dnbCompany }) => {
  return axios
    .post(`${urls.companies.match.link(company.id)}?_csrf=${csrfToken}`, {
      dnbCompany,
    })
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })
}
