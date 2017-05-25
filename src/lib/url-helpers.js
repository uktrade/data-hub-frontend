function getUrlVars () {
  var url = window.location.href
  var hash
  var myJson = {}
  var hashes = url.slice(url.indexOf('?') + 1).split('&')
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    myJson[hash[0]] = hash[1]
  }
  return myJson
}

function getQueryParam (param) {
  let params = getUrlVars()
  return params[param]
}

function getBackLink (params) {
  const referrer = (typeof document !== 'undefined') ? document.referrer : params.referrer
  if (!referrer || referrer.length === 0) return null
  // If the source was search
  if (referrer.includes('/company/')) {
    return { url: referrer, title: 'Back to company' }
  } else if (referrer.includes('/contact/')) {
    // or contact
    return { url: referrer, title: 'Back to contact' }
  } else if (referrer.includes('/interaction/')) {
    // or interaction
    return {url: referrer, title: 'Back to interaction'}
  } else if (referrer.includes('search')) {
    return {url: referrer, title: 'Back to search'}
  }
  return null
}

function buildQueryString (params) {
  let queryParams = []

  Object.keys(params).forEach((key) => {
    queryParams.push(`${key}=${params[key]}`)
  })

  return encodeURI(`?${queryParams.join('&')}`)
}

module.exports = {
  getQueryParam,
  getBackLink,
  buildQueryString
}
