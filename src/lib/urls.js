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
    const value = params[index]

    if (typeof value !== 'undefined') {
      path = path.replace(token, value)
    } else {
      path = path.replace('/' + token, '')
    }
  })

  return path
}

function url (mountPoint, subMountPoint, path) {
  let tokenPath

  if (path) {
    tokenPath = (subMountPoint + path)
  } else {
    tokenPath = (subMountPoint || '/')
    path = tokenPath
  }

  const tokens = getTokens(tokenPath)

  function getUrl (...params) {
    return (mountPoint + getPath(tokenPath, tokens, params))
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

function createInteractionsSubApp (...mountPoints) {
  if (mountPoints.length === 0) {
    mountPoints.push(null)
  }
  return {
    create: url(...mountPoints, '/interactions/:interactionId?/create'),
    createType: url(...mountPoints, '/interactions/create/:theme/:kind'),
  }
}

module.exports = {
  external: {
    greatProfile: (id) => config.greatProfileUrl.replace('{id}', id),
    companiesHouse: (companyNumber) => `https://beta.companieshouse.gov.uk/company/${companyNumber}`,
  },
  dashboard: url('/'),
  companies: {
    activity: {
      index: url('/companies', '/:companyId/activity'),
      data: url('/companies', '/:companyId/activity/data'),
    },
    advisers: {
      index: url('/companies', '/:companyId/advisers'),
      assign: url('/companies', '/:companyId/advisers/assign'),
      remove: url('/companies', '/:companyId/advisers/remove'),
    },
    audit: url('/companies', '/:companyId/audit'),
    editHistory: url('/companies', '/:companyId/edit-history'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    detail: url('/companies', '/:companyId'),
    edit: url('/companies', '/:companyId/edit'),
    archive: url('/companies', '/:companyId/archive'),
    unarchive: url('/companies', '/:companyId/unarchive'),
    dnbHierarchy: {
      index: url('/companies', '/:companyId/dnb-hierarchy'),
      data: url('/companies', '/:companyId/dnb-hierarchy/data'),
    },
    exports: {
      index: url('/companies', '/:companyId/exports'),
      edit: url('/companies', '/:companyId/exports/edit'),
    },
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
        link: url('/companies', '/:companyId/hierarchies/ghq/search'),
        remove: url('/companies', '/:companyId/hierarchies/ghq/remove'),
      },
    },
    index: url('/companies'),
    interactions: createInteractionsSubApp('/companies', '/:companyId'),
    orders: url('/companies', '/:companyId/orders'),
    investment: url('/companies', '/:companyId/investments'),
    investments: {
      largeCapitalProfile: url('/companies', '/:companyId/investments/large-capital-profile'),
    },
    subsidiaries: {
      index: url('/companies', '/:companyId/subsidiaries'),
      link: url('/companies', '/:companyId/subsidiaries/link'),
    },
  },
  contacts: {
    index: url('/contacts'),
    contact: url('/contacts', '/:contactId'),
    interactions: createInteractionsSubApp('/contacts', '/:contactId'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
  interactions: {
    subapp: createInteractionsSubApp(),
  },
  investments: {
    index: url('/investments'),
    projects: {
      index: url('/investments', '/projects'),
      documents: url('/investments', '/projects/:projectId/documents'),
      propositions: url('/investments', '/projects/:projectId/propositions'),
      interactions: createInteractionsSubApp('/investments', '/projects/:projectId'),
      project: url('/investments', '/projects/:projectId'),
      status: url('/investments', '/projects/:projectId/status'),
    },
    profiles: {
      index: url('/investments', '/profiles'),
      data: url('/investments', '/profiles/data'),
    },
  },
  omis: url('/omis/create?company=', ':companyId'),
  support: url('/support'),
}
