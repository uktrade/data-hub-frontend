import axios from 'axios'

import { apiProxyAxios } from '../../../../components/Task/utils'

export const deleteProjectDocument = (values) => {
  const options = {
    url: `v3/investment/${values.projectId}/evidence-document/${values.documentId}`,
    method: 'DELETE',
  }
  return apiProxyAxios(options)
}

export const addProjectDocument = async ({ projectId, values }) => {
  const { tags, comment, file } = values

  const { data: documentUploadData } = await apiProxyAxios.post(
    `v3/investment/${projectId}/evidence-document`,
    { tags, comment, original_filename: file.name }
  )

  return await uploadDocumentToS3(file, documentUploadData, projectId)
}

const uploadDocumentToS3 = async (file, documentUploadData, projectId) => {
  const { signed_upload_url: s3Url, id } = documentUploadData
  try {
    await axios.put(s3Url, file, {
      headers: { 'Content-type': 'applications/octet-stream' },
    })

    return await apiProxyAxios.post(
      `v3/investment/${projectId}/evidence-document/${id}/upload-callback`
    )
  } catch (err) {
    throw new Error(err)
    // return
  }
}
