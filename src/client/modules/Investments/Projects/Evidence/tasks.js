import axios from 'axios'

import { apiProxyAxios } from '../../../../components/Task/utils'
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_ERR_MSG,
} from '../../../../utils/file-upload-size'

export const deleteProjectDocument = (values) => {
  const options = {
    url: `v3/investment/${values.projectId}/evidence-document/${values.documentId}`,
    method: 'DELETE',
  }
  return apiProxyAxios(options)
}

export const addProjectDocument = async ({ projectId, values }) => {
  const { tags, comment, file } = values

  if (file.size > MAX_FILE_SIZE) {
    throw MAX_FILE_SIZE_ERR_MSG
  }

  const { data: documentUploadData } = await apiProxyAxios.post(
    `v3/investment/${projectId}/evidence-document`,
    { tags, comment, original_filename: file.name }
  )

  const { signed_upload_url: s3Url, id } = documentUploadData
  // This try catch block allows a rollback on the upload if the either of the
  // 2 calls below fail. The call above doesn't need to be in the try catch block
  // because if it fails no data will have been added to the database or to s3, and
  // the error will be caught within the task
  try {
    await uploadDocumentToS3(s3Url, file)

    return await apiProxyAxios.post(
      `v3/investment/${projectId}/evidence-document/${id}/upload-callback`
    )
  } catch (err) {
    await apiProxyAxios.delete(
      `v3/investment/${projectId}/evidence-document/${id}`
    )
    throw true
  }
}

const uploadDocumentToS3 = async (s3Url, file) => {
  return await axios.put(s3Url, file, {
    headers: { 'Content-type': 'applications/octet-stream' },
  })
}
