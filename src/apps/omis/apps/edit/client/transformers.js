export const transformAdvisersForAPI = (values) =>
  values.assignees.map((assignee) => ({
    adviser: {
      id: assignee.value,
    },
  }))

export const transformAdvisersForTypeahead = (advisers) =>
  advisers.map((value) => ({
    label: value.adviser.name,
    value: value.adviser.id,
  }))
