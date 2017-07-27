function transformToOptions (items, labelIteratee = (item) => item.name) {
  return items.map((item) => {
    return {
      value: item.id,
      label: labelIteratee(item),
    }
  })
}

function transformContactsToOptions (items) {
  return transformToOptions(items, (item) => {
    return `${item.first_name} ${item.last_name}`
  })
}

module.exports = {
  transformToOptions,
  transformContactsToOptions,
}
