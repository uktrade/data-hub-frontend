//TODO
export const transformFormValuesForAPI = (values) => {
  if (!values) {
    return values
  }
  return { ...values, owner: { id: values.owner?.value } }
}

const mapApiToField = (value) =>
  value ? { value: value.id, label: value.name } : {}

export const transformAPIValuesForForm = (initialValues) => {
  if (!initialValues) {
    return initialValues
  }

  return {
    ...initialValues,
    owner: mapApiToField(initialValues.owner),
  }
}
