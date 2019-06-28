const config = require('../../../config')
const { getOptions } = require('../../lib/options')
const { authorisedRequest } = require('../../lib/authorised-request')

function fetchInteraction (token, interactionId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction/${interactionId}`)
}

function saveInteraction (token, interaction) {
  const options = {
    url: `${config.apiRoot}/v3/interaction`,
    method: 'POST',
    body: interaction,
  }

  if (interaction.id) {
    options.url = `${options.url}/${interaction.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

async function getServiceOptions (req, res, createdOn) {
  const services = await getOptions(req.session.token, 'service', {
    createdOn,
  })
  return services
}

function getInteractionsForEntity ({ token, entityQuery, page = 1, sortby }) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/interaction`,
    qs: {
      ...entityQuery,
      limit,
      offset,
      sortby,
    },
  })
}

function archiveInteraction (token, interactionId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/interaction/${interactionId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

module.exports = {
  saveInteraction,
  fetchInteraction,
  getInteractionsForEntity,
  archiveInteraction,
  getServiceOptions,
}
