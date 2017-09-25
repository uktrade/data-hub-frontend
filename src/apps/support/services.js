const axios = require('axios')

const config = require('../../../config')

function createZenDeskMessage ({
  email,
  title,
  description = '',
  browser,
  feedbackType,
}) {
  return {
    requester: {
      name: 'Data Hub user',
      email,
    },
    subject: title,
    comment: {
      body: description,
    },
    custom_fields: [
      { id: config.zenBrowser, value: browser },
      { id: config.zenService, value: 'datahub_export' },
    ],
    tags: [feedbackType],
  }
}

function postToZenDesk (ticket) {
  return axios.post(config.zenUrl, { ticket },
    {
      auth: {
        username: `${config.zenEmail}/token`,
        password: config.zenToken,
      },
    }
  )
}

module.exports = {
  createZenDeskMessage,
  postToZenDesk,
}
