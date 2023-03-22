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
    estimated_export_value_years: values.estimated_export_value_years,
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
    estimated_export_value_years: initialValues.estimated_export_value_years.id,
  }
}
