// import { apiProxyAxios } from '../../../components/Task/utils'

import { FileResource } from "../../../components/Resource";

// export const deleteFile = (values) => apiProxyAxios.post('v4/document/', values)

// import { transformResponseToCollection } from './transformers'

// const handleError = (e) => Promise.reject(Error(e.response.data.detail))

// export const getDocument = ({ fileId }) =>
//   apiProxyAxios
//     .get(
//       `v4/document/${fileId}`
//     )
//     .then(
//       ({ data }) => transformResponseToCollection(relatedObjectId, data),
//       handleError
//     )

export default {
  ...FileResource.tasks,
}