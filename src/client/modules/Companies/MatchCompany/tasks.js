import { isEmpty, omit } from 'lodash'

import { apiProxyAxios } from '../../../components/Task/utils'

export const cannotFindMatchSubmit = ({ values, company }) => {
  const { address } = company
  const dnbInvestigation = {
    company: company.id,
    name: company.name,
    website: values.website,
    telephone_number: values.telephoneNumber,
    address: {
      ...omit(address, ['country', 'area']),
      line_1: address.line1,
      line_2: address.line2,
      country: address.country.id,
    },
  }
  if (!isEmpty(address.area)) {
    dnbInvestigation.address.area = address.area
  }

  return apiProxyAxios
    .post('v4/dnb/company-investigation', dnbInvestigation)
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })
}
