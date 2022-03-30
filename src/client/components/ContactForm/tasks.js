import { apiProxyAxios } from '../Task/utils'

export const saveContact = ({ contactId, values }) => {
  const request = contactId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = '/v4/contact'

  return request(contactId ? `${endpoint}/${contactId}` : endpoint, values)
    .catch((e) => {
      if (e?.errors) {
        return { data: e }
      } else {
        return Promise.reject(e.message)
      }
    })
    .then((response) => {
      return response.data
    })
}
