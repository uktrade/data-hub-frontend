function reverseDateIfIE(dateRequest, userAgent) {
  try {
    if (!userAgent.isIE || dateRequest === undefined) {
      return dateRequest
    }
    return dateRequest.split('/').reverse().join('/')
  } catch (error) {
    throw new Error(
      `When using date fields You must use "detect-useragent.js" middleware in your routes to detect a user agent for IE: ${error}`
    )
  }
}

module.exports = reverseDateIfIE
