import { apiProxyAxios } from '../Task/utils'

export const saveContact = ({ contactId, values }) => {
  const request = contactId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = '/v4/contact'

  // Including the full company record bloats the request and causes 413 errors with large companies.
  values.company = { id: values.company.id }

  return request(contactId ? `${endpoint}/${contactId}` : endpoint, values)
    .catch((e) => Promise.reject(e?.data?.email?.[0] || e.message))
    .then((response) => {
      return response.data
    })
}

export const redirectToContactForm = ({ values, url, storeId }) => {
  window.sessionStorage.setItem(storeId, JSON.stringify(values))
  window.location.href = url
}
