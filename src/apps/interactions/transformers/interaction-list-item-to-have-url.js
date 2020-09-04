const { assign } = require('lodash')

function transformInteractionListItemToHaveUrlPrefix(urlPrefix) {
  return function (item) {
    if (!urlPrefix) return item
    return assign({}, item, {
      urlPrefix:
        (urlPrefix.charAt(0) === '/' ? urlPrefix.substring(1) : urlPrefix) +
        '/',
    })
  }
}

module.exports = transformInteractionListItemToHaveUrlPrefix
