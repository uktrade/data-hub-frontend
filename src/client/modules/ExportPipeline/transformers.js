export const transformFormValuesForAPI = (values) => {
  if (!values) {
    return values
  }
  return {
    ...values,
    owner: { id: values.owner?.value },
    team_members: values.team_members?.map((t) => ({
      id: t.value,
    })),
  }
}

const mapApiValueToField = (value) => {
  if (!value) {
    return {}
  }
  if (Array.isArray(value)) {
    return value.map((v) => ({ value: v.id, label: v.name }))
  }
  return { value: value.id, label: value.name }
}

export const transformAPIValuesForForm = (initialValues) => {
  if (!initialValues) {
    return initialValues
  }

  return {
    ...initialValues,
    owner: mapApiValueToField(initialValues.owner),
    team_members: mapApiValueToField(initialValues.team_members),
  }
}
