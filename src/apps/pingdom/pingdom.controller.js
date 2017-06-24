const axios = require('axios')
const config = require('../../../config')

function responseTemplate (message) {
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <pingdom_http_custom_check>
      <status>${message}</status>
    </pingdom_http_custom_check>
  `.trim()
}

async function getHandler (req, res) {
  try {
    await axios.get(`${config.apiRoot}/ping.xml`, { responseType: 'text' })
    res
      .set('Content-Type', 'text/xml')
      .status(200)
      .send(responseTemplate('OK'))
  } catch (err) {
    res
      .set('Content-Type', 'text/xml')
      .status(err.response.status)
      .send(responseTemplate(err.response.statusText))
  }
}

module.exports = {
  getHandler,
}
