import { DOCUMENT_TYPES } from '../CollectionList/constants'

export const transformFileForApi = ({
  relatedObjectId,
  relatedObjectType,
  documentType,
  values,
}) => {
  let documentData = {}

  if (documentType === DOCUMENT_TYPES.SHAREPOINT.type) {
    const { url, title } = values
    documentData = {
      title: title,
      url: url,
    }
  } else if (documentType === DOCUMENT_TYPES.UPLOADABLE.type) {
    const { file, title } = values
    documentData = {
      original_filename: file[0].name,
      title: title || file[0].name,
      file_object: file[0],
    }
  }

  return {
    related_object_id: relatedObjectId,
    related_object_type: relatedObjectType,
    document_type: documentType,
    document_data: { ...documentData },
  }
}
