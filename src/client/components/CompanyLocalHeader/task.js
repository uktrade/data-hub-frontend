import { apiProxyAxios } from '../Task/utils'

export const getListsCompanyIsIn = ({ id }) => {
  return apiProxyAxios
    .get(`/v4/company-list?items__company_id=${id}`)
    .then(({ data }) => data)
}
