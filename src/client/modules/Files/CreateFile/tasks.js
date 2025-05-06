import axios from 'axios'

import { apiProxyAxios } from '../../../components/Task/utils'
import { DOCUMENT_TYPES } from '../CollectionList/constants'
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_ERR_MSG,
} from '../../../utils/file-upload-size'

export const createFile = async (values) => {
  if (values.document_type === DOCUMENT_TYPES.UPLOADABLE.type) {
    return uploadFile(values)
  } else {
    return apiProxyAxios.post('v4/document/', values)
  }
}

const uploadFile = async (values) => {
  const {
    /* eslint-disable-next-line no-unused-vars */
    original_filename: originalFilename,
    /* eslint-disable-next-line no-unused-vars */
    title,
    file_object: fileObject,
  } = values.document_data

  if (fileObject.size > MAX_FILE_SIZE) {
    throw MAX_FILE_SIZE_ERR_MSG
  }

  // Remove file_object from transformed payload as it's uploaded separately
  delete values.document_data.file_object

  // Step 1: Create the document record with metadata
  const response = await apiProxyAxios.post('v4/document/', values)
  const { id: genericDocumentID, signed_upload_url: signedUploadURL } =
    response.data

  try {
    // Step 2: Upload the extracted file to the signed url
    await axios.put(signedUploadURL, {
      method: 'PUT',
      data: fileObject,
      headers: {
        'Content-Type': fileObject.type,
      },
    })

    // Step 3: Notify the API that the upload is complete
    await apiProxyAxios.post(`v4/document/${genericDocumentID}/upload-complete`)

    return response
  } catch (error) {
    throw error
  }
}
