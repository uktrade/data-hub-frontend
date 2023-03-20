//TODO
export const transformFormValuesForAPI = (values) => ({
  ...values,
  owner: { id: values.owner.value },
})

const mapApiToField = (value) =>
  value ? { value: value.id, label: value.name } : {}
//TO test
export const transformAPIValuesForForm = (initialValues) => {
  if (!initialValues) {
    return initialValues
  }

  return {
    ...initialValues,
    owner: mapApiToField(initialValues.owner),
  }
}
