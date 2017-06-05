const axios = require('axios')

function getInflatedContact (token = null, id) {
  return axios.get(`/api/contact/${id}`)
    .then(response => response.data)
}

module.exports = {
  getInflatedContact,
}
