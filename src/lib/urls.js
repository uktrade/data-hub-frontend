const queryString = require('qs')
const { PRIMARY_LINK_PARAMS } = require('../../src/common/constants')

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
    index:
      mountPoint === '/interactions'
        ? url(mountPoint, PRIMARY_LINK_PARAMS.interactions, pathPrefix)
        : url(mountPoint, pathPrefix),
    detail: url(mountPoint, pathPrefix + '/:interactionId'),
    create: url(mountPoint, pathPrefix + '/create'),
    createType: url(mountPoint, pathPrefix + '/create/:theme/:kind'),
    edit: url(mountPoint, pathPrefix + '/:interactionId/edit'),
  }
}

module.exports = {
  testing: {
    index: url('/testing'),
  },
  external: {
    greatProfile: (id) =>
      `https://www.great.gov.uk/international/trade/suppliers/${id}`,
    companiesHouse: (companyNumber) =>
      `https://beta.companieshouse.gov.uk/company/${companyNumber}`,
    findExporters: () =>
      'https://data.trade.gov.uk/datasets/a70a3967-2352-4230-b556-61bf875dc28c',
    exportWins: () => 'https://www.exportwins.service.trade.gov.uk/',
    digitalWorkspace: {
      teams:
        'https://people.trade.gov.uk/teams/department-for-international-trade',
      accountManagement:
        'https://workspace.trade.gov.uk/working-at-dit/policies-and-guidance/strategic-relationship-account-management/',
      accountManagementStrategyTeam:
        'https://workspace.trade.gov.uk/working-at-dit/policies-and-guidance/the-account-management-strategy-team',
    },
    helpCentre: {
      accessibilityStatement: () =>
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/data-hub-accessibility-statement/data-hub-accessibility-statement/',
      dhHomepage: () => 'https://data-services-help.trade.gov.uk/data-hub/',
      pipeline: () =>
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/account-management/my-pipeline/',
      policyFeedback: () =>
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/interactions-and-service-delivery/record-business-intelligence-interaction/',
      tradeagreementGuidance: () =>
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/',
      cookies: () =>
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/data-hub-cookie-policy/',
      privacyNotice: () =>
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/data-hub-privacy-notice/',
      allUpdates: () =>
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/',
    },
    copyright:
      'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
    reminderAndSettings:
      'https://data-services-help.trade.gov.uk/data-hub/how-articles/reminders-and-email-notifications/',
  },

  dashboard: url('/'),
  oauth: {
    redirect: url('/oauth'),
    callback: url('/oauth/callback'),
    signout: url('/oauth/sign-out'),
  },
  companies: {
    index: url('/companies', PRIMARY_LINK_PARAMS.companies),
    create: url('/companies', '/create'),
    export: url('/companies', '/export'),
    detail: url('/companies', '/:companyId'),
    edit: url('/companies', '/:companyId/edit'),
    audit: url('/companies', '/:companyId/audit'),
    lists: {
      index: url('/companies', '/:companyId/lists'),
      addRemove: url('/companies', '/:companyId/lists/add-remove'),
    },
    pipelineAdd: url('/companies', '/:companyId/my-pipeline'),
    orders: url('/companies', '/:companyId/orders'),
    details: url('/companies', '/:companyId/details'),
    archive: url('/companies', '/:companyId/archive'),
    contacts: url('/companies', '/:companyId/contacts'),
    unarchive: url('/companies', '/:companyId/unarchive'),
    documents: url('/companies', '/:companyId/documents'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    editOneList: url('/companies', '/:companyId/edit-one-list'),
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
    overview: {
      index: url('/companies', '/:companyId/overview'),
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
      companyInvestmentProjects: url(
        '/companies',
        '/:companyId/investments/projects'
      ),
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
    index: url('/company-lists'),
    delete: url('/company-lists', '/:listId/delete'),
    rename: url('/company-lists', '/:listId/rename'),
  },
  contacts: {
    activity: {
      data: url('/contacts', '/:contactId/activity/data'),
    },
    index: url('/contacts', PRIMARY_LINK_PARAMS.contacts),
    export: url('/contacts', '/export'),
    audit: url('/contacts', '/:contactId/audit'),
    contact: url('/contacts', '/:contactId'),
    create: url('/contacts/create?company=', ':companyId'),
    contactActivities: url('/contacts', '/:contactId/interactions'),
    details: url('/contacts', '/:contactId/details'),
    documents: url('/contacts', '/:contactId/documents'),
    edit: url('/contacts', '/:contactId/edit'),
    interactions: createInteractionsSubApp(
      '/contacts',
      '/:contactId/interactions'
    ),
    archive: url('/contacts', '/:contactId/archive'),
    unarchive: url('/contacts', '/:contactId/unarchive'),
  },
  events: {
    activity: {
      data: url('/events', '/activity/data'),
    },
    index: url('/events', PRIMARY_LINK_PARAMS.events),
    create: url('/events/create'),
    details: url('/events', '/:eventId/details'),
    edit: url('/events', '/:eventId/edit'),
    attendees: url('/events', '/:eventId/attendees'),
    find: url('/events', '/:eventId/attendees/find-new'),
    addAttendee: url('/events', '/:eventId/attendees/create/:contactId'),
    aventri: {
      details: url('/events', '/aventri/:aventriEventId/details'),
      detailsData: url('/events', '/aventri/:aventriEventId/details/data'),
      registrationStatus: url(
        '/events',
        '/aventri/:aventriEventId/registration/:status'
      ),
      registrationStatusData: url(
        '/events',
        '/aventri/:aventriEventId/registration/attendees/data'
      ),
    },
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
  interactions: {
    ...createInteractionsSubApp('/interactions'),
    activeEvents: url('/activeEvents'),
    activeEventsData: url('/interactions', '/activeEvents'),
    export: url('/interactions', '/export'),
    exportSupportService: {
      details: url('/interactions', '/ess/:essInteractionId/details'),
      detailsData: url('/interactions', '/ess/:essInteractionId/details/data'),
    },
  },
  investments: {
    index: url('/investments', PRIMARY_LINK_PARAMS.investments),
    projects: {
      index: url('/investments', '/projects'),
      export: url('/investments', '/projects', '/export'),
      details: url('/investments', '/projects/:investmentId/details'),
      editDetails: url('/investments', '/projects/:investmentId/edit-details'),
      editRequirements: url(
        '/investments',
        '/projects/:investmentId/edit-requirements'
      ),
      editTeamMembers: url(
        '/investments',
        '/projects/:investmentId/edit-team-members'
      ),
      documents: url('/investments', '/projects/:investmentId/documents'),
      propositions: url('/investments', '/projects/:investmentId/propositions'),
      proposition: url(
        '/investments',
        '/projects/:investmentId/propositions/:propositionId'
      ),
      team: url('/investments', '/projects/:investmentId/team'),
      clientRelationshipManagement: url(
        '/investments',
        '/projects/:investmentId/edit-client-relationship-management'
      ),
      interactions: createInteractionsSubApp(
        '/investments/projects',
        '/:investmentId/interactions'
      ),
      project: url('/investments', '/projects/:projectId'),
      status: url('/investments', '/projects/:projectId/status'),
      admin: url('/investments', '/projects/:projectId/admin'),
      create: url('/investments', '/projects/create/:companyId'),
      editProjectManagement: url(
        '/investments',
        '/projects/:projectId/edit-project-management'
      ),
      typeInfo: url(
        '/investments',
        '/projects/create/investment-type/info/:anchor'
      ),
    },
    profiles: {
      index: url('/investments', '/profiles'),
      data: url('/investments', '/profiles/data'),
    },
    opportunities: {
      index: url('/investments', '/opportunities'),
      opportunity: url('/investments', '/opportunities/:opportunityId'),
      details: url('/investments', '/opportunities/:opportunityId/details'),
      interactions: url(
        '/investments',
        '/opportunities/:opportunityId/interactions'
      ),
      status: url('/investments', '/opportunities/:opportunityId/status'),
      create: url('/investments', '/opportunities/create'),
    },
    editHistory: {
      index: url('/investments/projects', '/:investmentId/edit-history'),
      data: url('/investments/projects', '/:investmentId/edit-history/data'),
    },
  },
  metadata: {
    likelihoodToLand: url('/api-proxy/v4/metadata', '/likelihood-to-land'),
    investmentInvestorType: url(
      '/api-proxy/v4/metadata',
      '/investment-investor-type'
    ),
    investmentInvolvement: url(
      '/api-proxy/v4/metadata',
      '/investment-involvement'
    ),
    investmentSpecificProgramme: url(
      '/api-proxy/v4/metadata',
      '/investment-specific-programme'
    ),
    investmentProjectStage: url(
      '/api-proxy/v4/metadata',
      '/investment-project-stage'
    ),
    investmentBusinessActivity: url(
      '/api-proxy/v4/metadata',
      '/investment-business-activity'
    ),
    investmentType: url('/api-proxy/v4/metadata', '/investment-type'),
    investmentStrategicDriver: url(
      '/api-proxy/v4/metadata',
      '/investment-strategic-driver'
    ),
    orderServiceType: url('/api-proxy/v4/metadata', '/order-service-type'),
    orderCancellationReason: url(
      '/api-proxy/v4/metadata',
      '/order-cancellation-reason'
    ),
    omisMarket: url('/api-proxy/v4/metadata', '/omis-market'),
    salaryRange: url('/api-proxy/v4/metadata', '/salary-range'),
    fdiValue: url('/api-proxy/v4/metadata', '/fdi-value'),
    fdiType: url('/api-proxy/v4/metadata', '/fdi-type'),
    turnover: url('/api-proxy/v4/metadata', '/turnover'),
    sector: url('/api-proxy/v4/metadata', '/sector'),
    locationType: url('/api-proxy/v4/metadata', '/location-type'),
    eventType: url('/api-proxy/v4/metadata', '/event-type'),
    programme: url('/api-proxy/v4/metadata', '/programme'),
    businessType: url('/api-proxy/v4/metadata', '/business-type'),
    evidenceTag: url('/api-proxy/v4/metadata', '/evidence-tag'),
    employeeRange: url('/api-proxy/v4/metadata', '/employee-range'),
    country: url('/api-proxy/v4/metadata', '/country'),
    ukRegion: url('/api-proxy/v4/metadata', '/uk-region'),
    administrativeArea: url('/api-proxy/v4/metadata', '/administrative-area'),
    referralSourceWebsite: url(
      '/api-proxy/v4/metadata',
      '/referral-source-website'
    ),
    referralSourceMarketing: url(
      '/api-proxy/v4/metadata',
      '/referral-source-marketing'
    ),
    referralSourceActivity: url(
      '/api-proxy/v4/metadata',
      '/referral-source-activity'
    ),
    headquarterType: url('/api-proxy/v4/metadata', '/headquarter-type'),
    service: url('/api-proxy/v4/metadata', '/service'),
    communicationChannel: url(
      '/api-proxy/v4/metadata',
      '/communication-channel'
    ),
    team: url('/api-proxy/v4/metadata', '/team'),
    policyArea: url('/api-proxy/v4/metadata', '/policy-area'),
    policyIssueType: url('/api-proxy/v4/metadata', '/policy-issue-type'),
    serviceDeliveryStatus: url(
      '/api-proxy/v4/metadata',
      '/service-delivery-status'
    ),
    capitalInvestmentInvestorType: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/investor-type'
    ),
    capitalInvestmentRequiredChecksConducted: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/required-checks-conducted'
    ),
    capitalInvestmentDealTicketSize: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/deal-ticket-size'
    ),
    capitalInvestmentLargeCapitalInvestment: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/large-capital-investment'
    ),
    capitalInvestmentReturnRate: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/return-rate'
    ),
    capitalInvestmentTimeHorizon: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/time-horizon'
    ),
    capitalInvestmentRestriction: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/restriction'
    ),
    capitalInvestmentConstructionRisk: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/construction-risk'
    ),
    capitalInvestmentEquityPercentage: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/equity-percentage'
    ),
    capitalInvestmentDesiredDealRole: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/desired-deal-role'
    ),
    capitalInvestmentAssetClassInterest: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/asset-class-interest'
    ),
    oneListTier: url('/api-proxy/v4/metadata', '/one-list-tier'),
    tradeAgreement: url('/api-proxy/v4/metadata', '/trade-agreement'),
  },
  omis: {
    index: url('/omis', PRIMARY_LINK_PARAMS.omis),
    export: url('/omis', '/export'),
    create: url('/omis/create?company=', ':companyId'),
    reconciliation: url('/omis/reconciliation'),
    order: url('/omis', '/:orderId'),
    paymentReconciliation: url(
      '/omis',
      '/:orderId',
      '/edit/payment-reconciliation'
    ),
    paymentReceipt: url('/omis', '/:orderId/payment-receipt'),
    workOrder: url('/omis', '/:orderId/work-order'),
    quote: url('/omis', '/:orderId/quote'),
    edit: {
      quote: url('/omis', '/:orderId/edit/quote-details'),
      assignees: url('/omis', '/:orderId/edit/assignees'),
      subscribers: url('/omis', '/:orderId/edit/subscribers'),
    },
  },
  support: url('/support'),
  pipeline: {
    index: url('/my-pipeline'),
    active: url('/my-pipeline/active'),
    won: url('/my-pipeline/won'),
    edit: url('/my-pipeline', '/:pipelineItemId/edit'),
    archive: url('/my-pipeline', '/:pipelineItemId/archive'),
    unarchive: url('/my-pipeline', '/:pipelineItemId/unarchive'),
    delete: url('/my-pipeline', '/:pipelineItemId/delete'),
  },
  reminders: {
    index: url('/reminders'),
    investments: {
      estimatedLandDate: url('/reminders/investments-estimated-land-dates'),
      noRecentInteraction: url('/reminders/investments-no-recent-interactions'),
      outstandingPropositions: url(
        '/reminders/investments-outstanding-propositions'
      ),
    },
    exports: {
      noRecentInteractions: url('/reminders/companies-no-recent-interactions'),
      newInteractions: url('/reminders/companies-new-interactions'),
    },
    settings: {
      index: url('/reminders/settings'),
      investments: {
        estimatedLandDate: url(
          '/reminders/settings/investments-estimated-land-dates'
        ),
        noRecentInteraction: url(
          '/reminders/settings/investments-no-recent-interactions'
        ),
      },
      exports: {
        noRecentInteraction: url(
          '/reminders/settings/companies-no-recent-interactions'
        ),
        newInteraction: url('/reminders/settings/companies-new-interactions'),
      },
    },
  },
  exportPipeline: {
    index: url('/export'),
    create: url('/export/create'),
    details: url('/export', '/:exportId/details'),
    edit: url('/export', '/:exportId/edit'),
    delete: url('/export', '/:exportId/delete'),
  },
}
