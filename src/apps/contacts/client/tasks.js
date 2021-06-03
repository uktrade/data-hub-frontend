import { apiProxyAxios } from '../../../client/components/Task/utils'
import { transformResponseToCollection } from './transformers'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getContacts = ({ limit = 10, page }) =>
  apiProxyAxios
    .post('/v3/search/contact', {
      limit,
      offset: limit * (page - 1),
      sortby: 'modified_on:desc',
      term: '',
      archived: false,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)
