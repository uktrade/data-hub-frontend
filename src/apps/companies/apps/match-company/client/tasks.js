import axios from 'axios'

import urls from '../../../../../lib/urls'

export const onMatchSubmit = ({ csrfToken, company, dnbCompany }) =>
  axios
    .post(`${urls.companies.match.link(company.id)}?_csrf=${csrfToken}`, {
      dnbCompany,
    })
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })

export const onCompanyFound = (data) => {
  return window.location.assign(
    urls.companies.match.confirmation(
      data.companyId,
      data.companyDnB.dnb_company.duns_number
    )
  )
}

export async function submitMergeRequest({ company, dnbCompany, csrfToken }) {
  await axios.post(
    `${urls.companies.match.merge(company.id)}?_csrf=${csrfToken}`,
    {
      dnbCompany,
    }
  )
  return company
}
