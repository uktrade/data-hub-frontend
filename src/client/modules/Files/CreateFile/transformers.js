export const transformFileForApi = ({
  relatedObjectId,
  relatedObjectType,
  documentType,
  values,
}) => {
  const { url, title } = values
  return {
    related_object_id: relatedObjectId,
    related_object_type: relatedObjectType,
    document_type: documentType,
    document_data: {
      title: title,
      url: url,
    },
  }
}
