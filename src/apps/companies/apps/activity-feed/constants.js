const ACTIVITY_STREAM_FEATURE_FLAG = 'user-activity-stream-aventri'

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
const CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS = {
  newest: 'desc',
  oldest: 'asc',
}

const CONTACT_ACTIVITY_SORT_SELECT_OPTIONS = [
  { name: 'Newest', value: 'newest' },
  { name: 'Oldest', value: 'oldest' },
]

const EVENT_ATTENDEES_SORT_OPTIONS = {
  'first_name:asc': {
    'object.dit:firstName': {
      order: 'asc',
      unmapped_type: 'string',
    },
  },
  'first_name:desc': {
    'object.dit:firstName': {
      order: 'desc',
      unmapped_type: 'string',
    },
  },
  'last_name:asc': {
    'object.dit:lastName': {
      order: 'asc',
      unmapped_type: 'string',
    },
  },
  'last_name:desc': {
    'object.dit:lastName': {
      order: 'desc',
      unmapped_type: 'string',
    },
  },
  'company_name:asc': {
    'object.dit:companyName': {
      order: 'asc',
      unmapped_type: 'string',
    },
  },
  'company_name:desc': {
    'object.dit:companyName': {
      order: 'desc',
      unmapped_type: 'string',
    },
  },
}

const EVENT_AVENTRI_ATTENDEES_STATUS = {
  attended: 'Attended',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  registered: 'Registered',
}

const EVENT_ACTIVITY_SORT_OPTIONS = {
  'modified_on:asc': {
    'object.updated': {
      order: 'asc',
      unmapped_type: 'date',
    },
  },
  'modified_on:desc': {
    'object.updated': {
      order: 'desc',
      unmapped_type: 'date',
    },
  },
  'name:asc': {
    'object.name.raw': {
      order: 'asc',
      unmapped_type: 'string',
    },
  },
  'start_date:asc': {
    'object.startTime': {
      order: 'asc',
      unmapped_type: 'date',
    },
  },
  'start_date:desc': {
    'object.startTime': {
      order: 'desc',
      unmapped_type: 'date',
    },
  },
}

const EVENT_ALL_ACTIVITY = {
  terms: {
    'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
  },
}

const DATA_HUB_ACTIVITY = [
  'dit:Interaction', // Interaction
  'dit:ServiceDelivery', // Interaction
  'dit:InvestmentProject',
  'dit:OMISOrder',
  'dit:CompanyReferral',
]

const DATA_HUB_AND_AVENTRI_ACTIVITY = [
  ...DATA_HUB_ACTIVITY,
  'dit:aventri:Event',
]

const EXTERNAL_ACTIVITY = [
  'dit:Accounts', // Companies House Accounts
  'dit:Company', // Companies House Company
  'dit:Export', // HMRC Exporter
]

const DATA_HUB_AND_EXTERNAL_ACTIVITY = [
  ...DATA_HUB_AND_AVENTRI_ACTIVITY,
  ...EXTERNAL_ACTIVITY,
]

module.exports = {
  EVENT_ATTENDEES_SORT_OPTIONS,
  EVENT_ACTIVITY_SORT_OPTIONS,
  EVENT_AVENTRI_ATTENDEES_STATUS,
  EVENT_ALL_ACTIVITY,
  FILTER_KEYS,
  FILTER_ITEMS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
  CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS,
  CONTACT_ACTIVITY_SORT_SELECT_OPTIONS,
  ACTIVITY_STREAM_FEATURE_FLAG,
  DATA_HUB_AND_AVENTRI_ACTIVITY,
}
