import { apiProxyAxios } from '../Task/utils'

export const saveContact = ({ contactId, values }) => {
  const request = contactId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = '/v4/contact'

  // Including the full company record bloats the request and causes 413 errors with large companies.
  values.company = { id: values.company.id }

  return request(
    contactId ? `${endpoint}/${contactId}` : endpoint,
    values
  ).then((response) => {
    return response.data
  })
}
