const queryString = require('qs')

const {
  INVESTMENT_LINK_PARAM,
  PRIMARY_LINK_PARAMS,
} = require('../../src/common/constants')

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
    companiesHouse: (companyNumber) =>
      `https://beta.companieshouse.gov.uk/company/${companyNumber}`,
    exportWins: 'https://www.exportwins.service.trade.gov.uk/',
    omis: 'https://omis.trade.gov.uk/',
    dataWorkspace: {
      findExporters:
        'https://data.trade.gov.uk/datasets/4a0da123-a933-4250-90b5-df5cde34930b',
      accountPlans: (id) =>
        `https://data.trade.gov.uk/visualisations/link/e69bbfde-0e68-49d3-ad81-ddffbad6bac6#p.CompanyID=${id}`,
    },
    nationalArchives: {
      copyright:
        'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
      openGovLicence:
        'https://www.nationalarchives.gov.uk/doc/open-government-licence',
    },
    great: {
      companyProfile: (id) =>
        `https://www.great.gov.uk/international/trade/suppliers/${id}`,
      privacyPolicy: 'https://www.great.gov.uk/uk/privacy-policy/',
    },
    govUkHomepage: 'https://www.gov.uk/',
    intranet: {
      teams:
        'https://people.trade.gov.uk/teams/department-for-international-trade',
      accountManagement:
        'https://workspace.trade.gov.uk/working-at-dit/policies-and-guidance/strategic-relationship-account-management/',
    },
    helpCentre: {
      community: {
        roadmap:
          'https://data-services-help.trade.gov.uk/data-hub/updates/roadmap/data-hub-roadmap/ ',
        feedback:
          'https://data-services-help.trade.gov.uk/data-hub/crm-community/feedback-or-propose-changes',
        principles:
          'https://data-services-help.trade.gov.uk/data-hub/crm-community/crm-principles',
        training:
          'https://data-services-help.trade.gov.uk/data-hub/crm-community/training',
      },
      accessibilityStatement:
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/data-hub-accessibility-statement/data-hub-accessibility-statement/',
      dhHomepage: 'https://data-services-help.trade.gov.uk/data-hub/',
      policyFeedback:
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/interactions-and-service-delivery/record-business-intelligence-interaction/',
      tradeAgreementGuidance:
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/',
      cookies:
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/data-hub-cookie-policy/',
      privacyNotice:
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/data-hub-privacy-notice/',
      allUpdates:
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/',
      referrals:
        'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/improving-collaboration-internal-referrals/',
      reminderAndSettings:
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/reminders-and-email-notifications/',
    },
    euVIES: 'https://ec.europa.eu/taxation_customs/vies/',
    cleanEnergyTransition:
      'https://www.gov.uk/government/consultations/aligning-uk-international-support-for-the-clean-energy-transition',
  },

  dashboard: {
    index: url('/'),
    investmentProjects: url('/investment-projects'),
    myTasks: url('/my-tasks'),
  },
  oauth: {
    redirect: url('/oauth'),
    callback: url('/oauth/callback'),
    signout: url('/oauth/sign-out'),
  },
  company: {
    exportWin: url('/api-proxy/v4/company', '/:companyId/export-win'),
  },
  community: {
    index: url('/community'),
  },
  companies: {
    index: url('/companies', PRIMARY_LINK_PARAMS.companies),
    create: url('/companies', '/create'),
    createFromDNB: url('/companies/create?duns_number=', ':dunsNumber'),
    export: url('/companies', '/export'),
    detail: url('/companies', '/:companyId'),
    edit: url('/companies', '/:companyId/edit'),
    audit: url('/companies', '/:companyId/audit'),
    lists: {
      index: url('/companies', '/:companyId/lists'),
      addRemove: url('/companies', '/:companyId/lists/add-remove'),
    },
    orders: url('/companies', '/:companyId/orders'),
    details: url('/companies', '/:companyId/details'),
    archive: url('/companies', '/:companyId/archive'),
    contacts: url('/companies', '/:companyId/contacts'),
    unarchive: url('/companies', '/:companyId/unarchive'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    editOneList: url('/companies', '/:companyId/edit-one-list'),
    editVirtualTeam: url(
      '/companies',
      '/:companyId/edit-one-list?step=oneListAdvisers'
    ),
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
    },
    editHistory: {
      index: url('/companies', '/:companyId/edit-history'),
      data: url('/companies', '/:companyId/edit-history/data'),
    },
    dnbHierarchy: {
      tree: url('/companies', '/:companyId/company-tree'),
      relatedCompaniesCount: url(
        '/v4/dnb',
        '/:companyId/related-companies/count'
      ),
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
    exportWins: {
      index: url('/exportwins'),
      confirmed: url('/exportwins/confirmed'),
      pending: url('/exportwins/pending'),
      rejected: url('/exportwins/rejected'),
      create: url('/companies', '/:companyId/exportwins/create'),
      createFromExport: url(
        '/companies',
        '/:companyId/export/:exportId/exportwins/create'
      ),
      createSuccess: url('/exportwins', '/:winId/success'),
      customerFeedback: url(
        '/companies',
        '/:companyId/exportwins/:winId/customer-feedback'
      ),
      editOfficerDetails: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit?step=officer_details'
      ),
      editCreditForThisWin: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit?step=credit_for_this_win'
      ),
      editCustomerDetails: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit?step=customer_details'
      ),
      editWinDetails: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit?step=win_details'
      ),
      editSupportProvided: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit?step=support_provided'
      ),
      editSummary: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit?step=summary'
      ),
      editSuccess: url(
        '/companies',
        '/:companyId/exportwins/:winId/edit-success'
      ),
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
        index: url('/companies', '/:companyId/subsidiaries'),
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
      companyInvestmentProjectsWithSearch: url(
        '/companies',
        '/:companyId/investments/projects?page=1&sortby=created_on%3Adesc'
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
    accountManagement: {
      index: url('/companies', '/:companyId/account-management'),
      strategy: {
        create: url(
          '/companies',
          '/:companyId/account-management/strategy/create'
        ),
        edit: url('/companies', '/:companyId/account-management/strategy/edit'),
      },
      objectives: {
        create: url(
          '/companies',
          '/:companyId/account-management/objective/create'
        ),
        edit: url(
          '/companies',
          '/:companyId/account-management/objective/:objectiveId/edit'
        ),
        archived: url(
          '/companies',
          '/:companyId/account-management/objective/archived'
        ),
        archive: url(
          '/companies',
          '/:companyId/account-management/objective/:objectiveId/archive'
        ),
      },
      advisers: {
        assign: url(
          '/companies',
          '/:companyId/account-management/advisers/assign'
        ),
        remove: url(
          '/companies',
          '/:companyId/account-management/advisers/remove'
        ),
      },
    },
  },
  companyLists: {
    index: url('/company-lists'),
    delete: url('/company-lists', '/:listId/delete'),
    rename: url('/company-lists', '/:listId/rename'),
  },
  contacts: {
    index: url('/contacts', PRIMARY_LINK_PARAMS.contacts),
    export: url('/contacts', '/export'),
    audit: url('/contacts', '/:contactId/audit'),
    contact: url('/contacts', '/:contactId'),
    create: url('/contacts/create?company=', ':companyId'),
    contactActivities: url('/contacts', '/:contactId/interactions'),
    details: url('/contacts', '/:contactId/details'),
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
      editValue: url('/investments', '/projects/:investmentId/edit-value'),
      propositions: url(
        '/investments',
        '/projects/:investmentId/propositions',
        INVESTMENT_LINK_PARAM
      ),
      proposition: {
        details: url(
          '/investments',
          '/projects/:investmentId/propositions/:propositionId'
        ),
        abandon: url(
          '/investments',
          '/projects/:investmentId/propositions/:propositionId/abandon'
        ),
        document: {
          index: url(
            '/investments',
            '/projects/:investmentId/propositions/:propositionId/document'
          ),
          delete: url(
            '/investments',
            '/projects/:investmentId/propositions/:propositionId/document/:documentId/delete'
          ),
        },
        complete: url(
          '/investments',
          '/projects/:investmentId/propositions/:propositionId/complete'
        ),
        create: url(
          '/investments',
          '/projects/:investmentId/propositions/create/proposition'
        ),
      },
      team: url('/investments', '/projects/:investmentId/team'),
      clientRelationshipManagement: url(
        '/investments',
        '/projects/:investmentId/edit-client-relationship-management'
      ),
      interactions: createInteractionsSubApp(
        '/investments/projects',
        '/:investmentId/interactions',
        INVESTMENT_LINK_PARAM
      ),
      status: url('/investments', '/projects/:projectId/status'),
      admin: url('/investments', '/projects/:projectId/admin'),
      create: url('/investments', '/projects/create/:companyId'),
      editProjectManagement: url(
        '/investments',
        '/projects/:projectId/edit-project-management'
      ),
      findAssociatedProject: url(
        '/investments',
        '/projects/:projectId/find-associated'
      ),
      editAssociatedProject: url(
        '/investments',
        '/projects/:projectId/edit-associated/:associatedProjectId'
      ),
      evidence: {
        index: url('/investments', '/projects/:projectId/evidence'),
        add: url('/investments', '/projects/:projectId/evidence/add-new'),
        delete: url(
          '/investments',
          '/projects/:projectId/evidence/:evidenceId/delete'
        ),
      },
      recipientCompany: url(
        '/investments',
        '/projects/:projectId/find-ukcompany'
      ),
      editRecipientCompany: url(
        '/investments',
        '/projects/:projectId/edit-ukcompany/:companyId'
      ),
      removeRecipientCompany: url(
        '/investments',
        '/projects/:projectId/remove-ukcompany'
      ),
      removeAssociatedProject: url(
        '/investments',
        '/projects/:projectId/remove-associated'
      ),
      evaluation: url('/investments', '/projects/:projectId/evaluation'),
      tasks: {
        index: url(
          '/investments',
          '/projects/:projectId/tasks',
          '?sortby=-created_on'
        ),
      },
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
      largeCapitalOpportunityDetails: url(
        '/api-proxy/v4/large-capital-opportunity',
        '/:opportunityId'
      ),
      status: url('/investments', '/opportunities/:opportunityId/status'),
      create: url('/investments', '/opportunities/create'),
    },
    editHistory: {
      index: url('/investments/projects', '/:investmentId/edit-history'),
      data: url('/investments/projects', '/:investmentId/edit-history/data'),
    },
    eybLeads: {
      index: url('/investments', '/eyb-leads'),
      details: url('/investments', '/eyb-leads/:eybLeadId/details'),
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
    capitalInvestmentLargeCapitalInvestmentType: url(
      '/api-proxy/v4/metadata/capital-investment',
      '/large-capital-investment-type'
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
    largeCapitalOpportunityMetadata: url(
      '/api-proxy/v4/metadata/large-capital-opportunity',
      '/opportunity-value-type'
    ),
    oneListTier: url('/api-proxy/v4/metadata', '/one-list-tier'),
    tradeAgreement: url('/api-proxy/v4/metadata', '/trade-agreement'),
    overseasRegion: url('/api-proxy/v4/metadata', '/overseas-region'),
  },
  omis: {
    index: url('/omis', PRIMARY_LINK_PARAMS.omis),
    export: url('/omis', '/export'),
    create: {
      companySelect: url('/omis', '/create'),
      form: url('/omis', '/create/:companyId'),
    },
    reconciliation: url(
      '/omis/reconciliation',
      PRIMARY_LINK_PARAMS.reconciliation
    ),
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
      internalInfo: url('/omis', '/:orderId/edit/internal-details'),
      invoiceDetails: url('/omis', '/:orderId/edit/invoice-details'),
      billingAddress: url('/omis', '/:orderId/edit/billing-address'),
      vatStatus: url('/omis', '/:orderId/edit/vat-status'),
      assigneeTime: url('/omis', '/:orderId/edit/assignee-time'),
      contact: url('/omis', '/:orderId/edit/contact'),
      setLeadAssignee: url('/omis', '/:orderId/edit/lead-adviser/:adviserId'),
    },
    cancel: url('/omis', '/:orderId/edit/cancel-order'),
    complete: url('/omis', '/:orderId/edit/complete-order'),
    paymentReceiptReconciliation: url(
      '/omis',
      '/:orderId/reconciliation/payment-receipt'
    ),
  },
  support: url('/support'),
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
    myTasks: {
      dueDateApproaching: url('/reminders/my-tasks-due-date-approaching'),
      taskAssignedToMeFromOthers: url(
        '/reminders/my-tasks-task-assigned-to-me-from-others'
      ),
      taskAmendedByOthers: url('/reminders/my-tasks-task-amended-by-others'),
      taskOverdue: url('/reminders/my-tasks-task-overdue'),
      taskCompleted: url('/reminders/my-tasks-task-completed'),
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
      myTasks: {
        dueDateApproaching: url(
          '/reminders/settings/my-tasks-due-date-approaching'
        ),
        taskAssignedToMeFromOthers: url(
          '/reminders/settings/my-tasks-task-assigned-to-me-from-others'
        ),
        taskAmendedByOthers: url(
          '/reminders/settings/my-tasks-task-amended-by-others'
        ),
        taskOverdue: url('/reminders/settings/my-tasks-task-overdue'),
        taskCompleted: url('/reminders/settings/my-tasks-task-completed'),
      },
    },
  },
  exportPipeline: {
    index: url('/export'),
    create: url('/export/create?companyId=', ':companyId'),
    details: url('/export', '/:exportId/details'),
    interactions: url('/export', '/:exportId/interactions'),
    edit: url('/export', '/:exportId/edit'),
    delete: url('/export', '/:exportId/delete'),
  },
  tasks: {
    details: url('/tasks', '/:taskId/details'),
    create: url('/tasks', '/create'),
    createInvestmentProject: url(
      '/tasks/create?investmentProjectId=',
      ':investmentProjectId'
    ),
    createInteraction: url('/tasks/create?interactionId=', ':interactionId'),
    createCopyTask: url('/tasks/create?copyTaskId=', ':copyTaskId'),
    edit: url('/tasks', '/:taskId/edit'),
    statusComplete: url('/tasks', '/:taskId/status-complete'),
    statusActive: url('/tasks', '/:taskId/status-active'),
    archive: url('/tasks', '/:taskId/archive'),
    unarchive: url('/tasks', '/:taskId/unarchive'),
  },
}
