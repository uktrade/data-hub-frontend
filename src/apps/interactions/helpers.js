const { get } = require('lodash')

const getReturnLink = (interactions) => {
  return get(interactions, 'returnLink', '/interactions')
}

module.exports = {
  getReturnLink,
}
