import axios from 'axios'

import urls from '../../../../lib/urls'

export const cannotFindMatchSubmit = ({ csrfToken, values, company }) =>
  axios
    .post(urls.companies.match.cannotFind(company.id), {
      _csrf: csrfToken,
      website: values.website,
      telephone_number: values.telephoneNumber,
    })
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })
