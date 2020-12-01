const FILTER_KEYS = {
  dataHubAndExternalActivity: 'dataHubAndExternalActivity',
  myActivity: 'myActivity',
  externalActivity: 'externalActivity',
  dataHubActivity: 'dataHubActivity',
}

const FILTER_ITEMS = {
  dataHubAndExternalActivity: {
    label: 'All Data Hub & external activity',
    value: FILTER_KEYS.dataHubAndExternalActivity,
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

const DATA_HUB_ACTIVITY = [
  'dit:Interaction', // Interaction
  'dit:ServiceDelivery', // Interaction
  'dit:InvestmentProject',
  'dit:OMISOrder',
  'dit:CompanyReferral',
]

const EXTERNAL_ACTIVITY = [
  'dit:Accounts', // Companies House Accounts
  'dit:Company', // Companies House Company
  'dit:Export', // HMRC Exporter
]

const DATA_HUB_AND_EXTERNAL_ACTIVITY = [
  ...DATA_HUB_ACTIVITY,
  ...EXTERNAL_ACTIVITY,
]

module.exports = {
  FILTER_KEYS,
  FILTER_ITEMS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
}
