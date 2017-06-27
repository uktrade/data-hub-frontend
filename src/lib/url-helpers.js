function buildQueryString (params) {
  let queryParams = []

  Object.keys(params).forEach((key) => {
    queryParams.push(`${key}=${params[key]}`)
  })

  return encodeURI(`?${queryParams.join('&')}`)
}

module.exports = {
  buildQueryString,
}
