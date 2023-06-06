const assembleDateTimeFilterScript = (params, filters) => {
  return (
    // Use object.startTime or fall back to object.published.
    "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); " +
    // Parse parameter to make available for use.
    Object.entries(params)
      .map(([key]) => {
        return `ZonedDateTime ${key} = ZonedDateTime.parse(params['${key}']);`
      })
      .join(' ') +
    // Add before/after filters
    ' return (' +
    filters.join(' && ') +
    ')'
  )
}

const datePeriodFilter = (dateAfter, dateBefore) => {
  let filters = []
  let params = {}
  dateAfter = dateAfter ? new Date(dateAfter) : null
  dateBefore = dateBefore ? new Date(dateBefore) : null
  if (dateAfter) {
    filters.push('filterDateTime.isAfter(dateAfter)')
    params.dateAfter = dateAfter.toISOString()
  }
  if (dateBefore) {
    filters.push('filterDateTime.isBefore(dateBefore)')
    params.dateBefore = dateBefore.toISOString()
  }
  return {
    script: {
      script: {
        lang: 'painless',
        source: assembleDateTimeFilterScript(params, filters),
        params: params,
      },
    },
  }
}

module.exports = { datePeriodFilter }
