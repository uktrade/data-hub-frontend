const assembleDateTimeFilterScript = (params, filters) => {
  return (
    // Use object.startTime or fall back to object.published.
    "ZonedDateTime filterDateTime = ((doc['object.startTime'].size() > 0) ? doc['object.startTime'].value : doc['object.published'].value); " +
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
  if (dateAfter) {
    dateAfter = dateAfter ? new Date(dateAfter) : null
    filters.push('filterDateTime.isAfter(dateAfter)')
    params.dateAfter = dateAfter.toISOString()
  }
  if (dateBefore) {
    if (typeof dateBefore === 'string') {
      const addTime = dateBefore.length <= 10
      dateBefore = new Date(dateBefore)
      if (addTime) {
        dateBefore.setUTCHours(23)
        dateBefore.setUTCMinutes(59)
        dateBefore.setUTCSeconds(59)
        dateBefore.setUTCMilliseconds(999)
      }
    }
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
