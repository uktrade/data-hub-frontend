import { apiProxyAxios } from '../Task/utils'

const _saveContact = (contactId, values) => {
  const request = contactId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = '/api-proxy/v4/contact'

  return request(contactId ? `${endpoint}/${contactId}` : endpoint, values)
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })
}

export const saveContact = ({ contactId, duplicateEmail, values }) => {
  // Check if contact with same email exists on company
  if (!contactId && (!duplicateEmail || duplicateEmail !== values.email)) {
    return apiProxyAxios
      .get(`/api-proxy/v4/contact`, { params: { email: values.email } })
      .then(({ data }) => {
        if (data.count) {
          return values.email
        } else {
          return _saveContact(contactId, values)
        }
      })
  } else {
    return _saveContact(contactId, values)
  }
}
