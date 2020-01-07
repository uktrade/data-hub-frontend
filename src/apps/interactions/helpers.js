const { get, includes } = require('lodash')
const { INTERACTION_CONTEXTS } = require('./constants')

const getReturnLink = (interactions) => {
  return get(interactions, 'returnLink', '/interactions')
}

const isInteractionServiceForm = (context) =>
  includes(INTERACTION_CONTEXTS, context)

module.exports = {
  getReturnLink,
  isInteractionServiceForm,
}
