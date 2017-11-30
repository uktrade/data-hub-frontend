/* eslint-disable camelcase */
const axios = require('axios')
const { get } = require('lodash')

const config = require('../../../config')

function createZenDeskMessage ({
  email,
  title,
  description = '',
  browser,
  feedback_type,
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
      { id: get(config, 'zen.browser'), value: browser },
      { id: get(config, 'zen.service'), value: get(config, 'zen.serviceChannel') },
    ],
    tags: [ feedback_type ],
  }
}

function postToZenDesk (ticket) {
  return axios.post(config.zen.url, { ticket },
    {
      auth: {
        username: `${config.zen.email}/token`,
        password: config.zen.token,
      },
    }
  )
}

module.exports = {
  createZenDeskMessage,
  postToZenDesk,
}
