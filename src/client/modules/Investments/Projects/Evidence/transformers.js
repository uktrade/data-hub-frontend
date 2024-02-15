export const transformEvidenceForApi = (values) => {
  const tags = Object.keys(values)
    .filter((value) => value.includes('criteria'))
    .map((value) => values[value])

  return {
    tags,
    comment: values.comment,
    file: values.file_upload,
  }
}
