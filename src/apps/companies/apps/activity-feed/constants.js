const ES_KEYS = {
  companiesHouseAccount: 'dit:Accounts',
  companiesHouseCompany: 'dit:Company',
  hmrcExporter: 'dit:Export',
  interaction: 'dit:Interaction',
  serviceDelivery: 'dit:ServiceDelivery',
  investmentProject: 'dit:InvestmentProject',
  omis: 'dit:OMISOrder',
  type: 'object.type',
  attributedTo: 'object.attributedTo.id',
  companyReferral: 'dit:CompanyReferral',
}

const ES_KEYS_GROUPED = {
  allActivity: [
    ES_KEYS.companiesHouseAccount,
    ES_KEYS.companiesHouseCompany,
    ES_KEYS.hmrcExporter,
    ES_KEYS.interaction, // Interaction
    ES_KEYS.serviceDelivery, // Interaction
    ES_KEYS.investmentProject,
    ES_KEYS.omis,
    ES_KEYS.companyReferral,
  ],

  externalActivity: [
    ES_KEYS.companiesHouseAccount,
    ES_KEYS.companiesHouseCompany,
    ES_KEYS.hmrcExporter,
  ],

  dataHubActivity: [
    ES_KEYS.interaction, // Interaction
    ES_KEYS.serviceDelivery, // Interaction
    ES_KEYS.investmentProject,
    ES_KEYS.omis,
    ES_KEYS.companyReferral,
  ],
}

const FILTER_KEYS = {
  allActivity: 'allActivity',
  myActivity: 'myActivity',
  externalActivity: 'externalActivity',
  dataHubActivity: 'dataHubActivity',
  ultimateHQSubsidiaries: 'ultimateHQSubsidiaries',
}

const FILTER_ITEMS = {
  allActivity: {
    label: 'All Data Hub & external activity',
    value: FILTER_KEYS.allActivity,
  },

  externalActivity: {
    label: 'All external activity',
    value: FILTER_KEYS.externalActivity,
  },

  myActivity: {
    label: 'My activity',
    value: FILTER_KEYS.myActivity,
  },

  dataHubActivity: {
    label: 'All Data Hub activity',
    value: FILTER_KEYS.dataHubActivity,
  },
}

module.exports = {
  ES_KEYS,
  FILTER_KEYS,
  FILTER_ITEMS,
  ES_KEYS_GROUPED,
}
