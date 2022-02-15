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

export const transformSubscribersForAPI = (values) =>
  values.subscribers.map((subscriber) => ({
    id: subscriber.value,
  }))

export const transformSubscribersForTypeahead = (subscribers) =>
  subscribers.map((value) => ({
    label: value.name,
    value: value.id,
  }))
