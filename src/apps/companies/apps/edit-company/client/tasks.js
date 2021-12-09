import axios from 'axios'
import urls from '../../../../../lib/urls'
import { UNITED_STATES_ID, CANADA_ID } from '../../../../../common/constants'

export const editCompany = ({ csrfToken, company, values }) => {
  values.address = { ...values.address, area: null }
  values.area = null

  if (values?.address?.country?.id === UNITED_STATES_ID) {
    values.address = { ...values.address, area: { id: values.areaUS } }
    values.area = { id: values.areaUS }
  } else if (values?.address?.country?.id === CANADA_ID) {
    values.address = { ...values.address, area: { id: values.areaCanada } }
    values.area = { id: values.areaCanada }
  }

  // The user has made some changes so make an API call
  return axios
    .post(urls.companies.edit(company.id), values, {
      params: { _csrf: csrfToken },
    })
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })
}
