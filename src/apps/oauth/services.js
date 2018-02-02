const request = require('request-promise')

const config = require('./../../../config')

function getAccessToken (oauthCode) {
  const options = {
    method: 'POST',
    url: config.oauth.tokenFetchUrl,
    formData: {
      code: oauthCode,
      grant_type: 'authorization_code',
      client_id: config.oauth.clientId,
      client_secret: config.oauth.clientSecret,
      redirect_uri: config.oauth.redirectUri,
    },
    json: true,
  }

  return request(options)
}

module.exports = {
  getAccessToken,
}
