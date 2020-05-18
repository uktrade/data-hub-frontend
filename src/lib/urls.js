const queryString = require('qs')

function getTokens(path) {
  const tokens = []
  const parts = path.split('/')

  parts.forEach((part) => {
    if (part.startsWith(':')) {
      tokens.push(part)
    }
  })

  return tokens
}

function getPath(mountPoint, path, tokens, params) {
  if (path === '/') {
    return mountPoint
  }

  return []
    .concat(params)
    .reduce((acc, param, index) => {
      if (param && param.constructor === Object) {
        return (
          acc + (acc.includes('?') ? '&' : '?') + queryString.stringify(param)
        )
      } else if (tokens[index]) {
        return acc.replace(tokens[index], param)
      }
      return acc
    }, mountPoint + path)
    .replace(/\/:\w+\?\//, '/')
}

function url(mountPoint, subMountPoint, path) {
  let tokenPath

  if (path) {
    tokenPath = subMountPoint + path
  } else {
    tokenPath = subMountPoint || '/'
    path = tokenPath
  }

  const tokens = getTokens(tokenPath)

  function getUrl(...params) {
    return getPath(mountPoint, tokenPath, tokens, params)
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

function createInteractionsSubApp(mountPoint, pathPrefix = '') {
  return {
    index: url(mountPoint, pathPrefix),
    detail: url(mountPoint, pathPrefix + '/:interactionId'),
    create: url(mountPoint, pathPrefix + '/create'),
    createType: url(mountPoint, pathPrefix + '/create/:theme/:kind'),
    edit: url(mountPoint, pathPrefix + '/:interactionId/edit'),
    complete: url(mountPoint, pathPrefix + '/:interactionId/complete'),
  }
}

module.exports = {
  external: {
    greatProfile: (id) =>
      `https://www.great.gov.uk/international/trade/suppliers/${id}`,
    companiesHouse: (companyNumber) =>
      `https://beta.companieshouse.gov.uk/company/${companyNumber}`,
    findExporters: () => 'https://find-exporters.datahub.trade.gov.uk/',
    exportWins: () => 'https://www.exportwins.service.trade.gov.uk/',
    digitalWorkspace: {
      teams:
        'https://people.trade.gov.uk/teams/department-for-international-trade',
    },
  },
  dashboard: url('/'),
  companies: {
    index: url('/companies'),
    create: url('/companies', '/create'),
    export: url('/companies', '/export'),
    detail: url('/companies', '/:companyId'),
    edit: url('/companies', '/:companyId/edit'),
    audit: url('/companies', '/:companyId/audit'),
    lists: {
      index: url('/companies', '/:companyId/lists'),
      addRemove: url('/companies', '/:companyId/lists/add-remove'),
    },
    pipeline: url('/companies', '/:companyId/my-pipeline'),
    orders: url('/companies', '/:companyId/orders'),
    details: url('/companies', '/:companyId/details'),
    archive: url('/companies', '/:companyId/archive'),
    contacts: url('/companies', '/:companyId/contacts'),
    unarchive: url('/companies', '/:companyId/unarchive'),
    documents: url('/companies', '/:companyId/documents'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    interactions: createInteractionsSubApp(
      '/companies',
      '/:companyId/interactions'
    ),
    manageCompanyList: url('/companies', '/:companyId/manage-company-list'),
    referrals: {
      list: url('/my-referrals'),
      send: url('/companies', '/:companyId/referrals/send'),
      details: url('/companies', '/:companyId/referrals/:referralId'),
      help: url('/companies', '/:companyId/referrals/:referralId/help'),
      interactions: createInteractionsSubApp(
        '/companies',
        '/:companyId/referrals/:referralId/interactions'
      ),
    },
    activity: {
      index: url('/companies', '/:companyId/activity'),
      data: url('/companies', '/:companyId/activity/data'),
    },
    advisers: {
      index: url('/companies', '/:companyId/advisers'),
      assign: url('/companies', '/:companyId/advisers/assign'),
      remove: url('/companies', '/:companyId/advisers/remove'),
    },
    editHistory: {
      index: url('/companies', '/:companyId/edit-history'),
      data: url('/companies', '/:companyId/edit-history/data'),
    },
    dnbHierarchy: {
      index: url('/companies', '/:companyId/dnb-hierarchy'),
      data: url('/companies', '/:companyId/dnb-hierarchy/data'),
    },
    exports: {
      index: url('/companies', '/:companyId/exports'),
      edit: url('/companies', '/:companyId/exports/edit'),
      editCountries: url('/companies', '/:companyId/exports/edit-countries'),
      history: {
        index: url('/companies', '/:companyId/exports/history'),
        country: url('/companies', '/:companyId/exports/history/:countryId'),
      },
    },
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
        link: url('/companies', '/:companyId/hierarchies/ghq/search'),
        remove: url('/companies', '/:companyId/hierarchies/ghq/remove'),
      },
      subsidiaries: {
        search: url(
          '/companies',
          '/:companyId/hierarchies/subsidiaries/search'
        ),
        add: url(
          '/companies',
          '/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add'
        ),
      },
    },
    investments: {
      companyInvestment: url('/companies', '/:companyId/investments'),
      largeCapitalProfile: url(
        '/companies',
        '/:companyId/investments/large-capital-profile'
      ),
    },
    match: {
      index: url('/companies', '/:companyId/match'),
      confirmation: url('/companies', '/:companyId/match/:dunsNumber'),
      link: url('/companies', '/:companyId/match/link'),
      merge: url('/companies', '/:companyId/match/merge'),
      cannotFind: url('/companies', '/:companyId/match/cannot-find'),
    },
    subsidiaries: {
      index: url('/companies', '/:companyId/subsidiaries'),
      link: url('/companies', '/:companyId/subsidiaries/link'),
    },
  },
  companyLists: {
    delete: url('/company-lists', '/:listId/delete'),
    rename: url('/company-lists', '/:listId/rename'),
  },
  contacts: {
    index: url('/contacts'),
    audit: url('/contacts', '/:contactId/audit'),
    contact: url('/contacts', '/:contactId'),
    create: url('/contacts/create?company=', ':companyId'),
    contactInteractions: url('/contacts', '/:contactId/interactions'),
    details: url('/contacts', '/:contactId/details'),
    documents: url('/contacts', '/:contactId/documents'),
    edit: url('/contacts', '/:contactId/edit'),
    interactions: createInteractionsSubApp(
      '/contacts',
      '/:contactId/interactions'
    ),
  },
  events: {
    index: url('/events'),
    create: url('/events/create'),
    details: url('/events', '/:eventId/details'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
  interactions: {
    ...createInteractionsSubApp('/interactions'),
  },
  investments: {
    index: url('/investments'),
    projects: {
      index: url('/investments', '/projects'),
      details: url('/investments', '/projects/:investmentId/details'),
      editDetails: url('/investments', '/projects/:investmentId/edit-details'),
      documents: url('/investments', '/projects/:investmentId/documents'),
      propositions: url('/investments', '/projects/:investmentId/propositions'),
      team: url('/investments', '/projects/:investmentId/team'),
      interactions: createInteractionsSubApp(
        '/investments/projects',
        '/:investmentId/interactions'
      ),
      project: url('/investments', '/projects/:projectId'),
      status: url('/investments', '/projects/:projectId/status'),
      admin: url('/investments', '/projects/:projectId/admin'),
    },
    profiles: {
      index: url('/investments', '/profiles'),
      data: url('/investments', '/profiles/data'),
    },
    editHistory: {
      index: url('/investments/projects', '/:investmentId/edit-history'),
      data: url('/investments/projects', '/:investmentId/edit-history/data'),
    },
  },
  omis: {
    index: url('/omis'),
    create: url('/omis/create?company=', ':companyId'),
  },
  support: url('/support'),
  pipeline: {
    index: url('/my-pipeline'),
    active: url('/my-pipeline/active'),
    won: url('/my-pipeline/won'),
  },
}
