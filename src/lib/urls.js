const config = require('../config')

function getTokens (path) {
  const tokens = []
  const parts = path.split('/')

  parts.forEach((part) => {
    if (part.startsWith(':')) {
      tokens.push(part)
    }
  })

  return tokens
}

function getPath (path, tokens, params) {
  if (path === '/') {
    return ''
  }
  tokens.forEach((token, index) => {
    path = path.replace(token, params[index])
  })
  return path
}

function url (mountPoint, path = '/') {
  const tokens = getTokens(path)

  function getUrl (...params) {
    return (mountPoint + getPath(path, tokens, params))
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

module.exports = {
  external: {
    greatProfile: (id) => config.greatProfileUrl.replace('{id}', id),
  },
  dashboard: url('/'),
  companies: {
    activity: {
      index: url('/companies', '/:companyId/activity'),
      data: url('/companies', '/:companyId/activity/data'),
    },
    advisers: url('/companies', '/:companyId/advisers'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    detail: url('/companies', '/:companyId'),
    dnbSubsidiaries: {
      index: url('/companies', '/:companyId/dnb-subsidiaries'),
      data: url('/companies', '/:companyId/dnb-subsidiaries/data'),
    },
    exports: url('/companies', '/:companyId/exports'),
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
      },
    },
    index: url('/companies'),
    interactions: {
      create: url('/companies', '/:companyId/interactions/create'),
    },
    subsidiaries: url('/companies', '/:companyId/subsidiaries'),
  },
  contacts: {
    index: url('/contacts'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
}
