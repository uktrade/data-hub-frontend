const axios = require('axios')

const config = require('../../../config')

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
  postToZenDesk,
}
