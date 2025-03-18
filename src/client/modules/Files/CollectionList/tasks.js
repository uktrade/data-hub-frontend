import { transformResponseToCollection } from './transformers'
import { apiProxyAxios } from '../../../components/Task/utils'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getFiles = ({ page, limit = 10, sortby, relatedObjectId }) =>
  apiProxyAxios
    .get(
      `v4/document/?related_object_id=${relatedObjectId}&limit=${limit}&offset=${limit * (page - 1)}&sortby=${sortby}`
    )
    .then(
      ({ data }) => transformResponseToCollection(relatedObjectId, data),
      handleError
    )
