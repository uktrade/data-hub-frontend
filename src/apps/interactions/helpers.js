const { get, includes } = require('lodash')
const { INTERACTION_CONTEXTS } = require('./constants')

const getReturnLink = interactions => {
  return get(interactions, 'returnLink', '/interactions')
}

const isInteractionServiceForm = (key, context) =>
  key === 'service' && includes(INTERACTION_CONTEXTS, context) === true

module.exports = {
  getReturnLink,
  isInteractionServiceForm,
}
