import axios from 'axios'

export const saveContact = ({ contactId, values }) => {
  const request = contactId ? axios.patch : axios.post
  const endpoint = '/api-proxy/v4/contact'

  return request(contactId ? `${endpoint}/${contactId}` : endpoint, values)
    .catch((e) => {
      return Promise.reject(e.message)
    })
    .then((response) => {
      return response.data
    })
}
