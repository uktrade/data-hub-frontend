const FILTER_FEED_TYPE = {
  ALL: 'all',
  RECENT: 'recent',
  UPCOMING: 'upcoming',
}

const CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS = {
  newest: 'desc',
  oldest: 'asc',
}

const CONTACT_ACTIVITY_SORT_SELECT_OPTIONS = [
  { name: 'Newest', value: 'date:desc' },
  { name: 'Oldest', value: 'date:asc' },
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
  activated: 'Activated',
  attended: 'Attended',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  noShow: 'No Show',
  waitlist: 'Waitlist',
}

const EVENT_AVENTRI_ATTENDEES_STATUSES = Object.values(
  EVENT_AVENTRI_ATTENDEES_STATUS
)

const EVENT_ATTENDEES_STATUS = {
  registered: 'Registered',
  waitingList: 'Waiting list',
  didNotAttend: 'Did not attend',
  attended: 'Attended',
  cancelled: 'Cancelled',
}

const createMappingObject = (status, aventriStatuses) => ({
  [status]: {
    statuses: aventriStatuses,
    urlSlug: status.replaceAll(' ', '-').toLowerCase(),
  },
})

const EVENT_ATTENDEES_MAPPING = [
  createMappingObject(EVENT_ATTENDEES_STATUS.registered, [
    EVENT_AVENTRI_ATTENDEES_STATUS.activated,
    EVENT_AVENTRI_ATTENDEES_STATUS.confirmed,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.cancelled, [
    EVENT_AVENTRI_ATTENDEES_STATUS.cancelled,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.attended, [
    EVENT_AVENTRI_ATTENDEES_STATUS.attended,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.didNotAttend, [
    EVENT_AVENTRI_ATTENDEES_STATUS.noShow,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.waitingList, [
    EVENT_AVENTRI_ATTENDEES_STATUS.waitlist,
  ]),
].reduce((a, v) => ({ ...a, ...v }), {})

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
  'dit:aventri:Event',
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
  EVENT_ATTENDEES_SORT_OPTIONS,
  EVENT_ACTIVITY_SORT_OPTIONS,
  EVENT_AVENTRI_ATTENDEES_STATUS,
  EVENT_AVENTRI_ATTENDEES_STATUSES,
  EVENT_ALL_ACTIVITY,
  FILTER_FEED_TYPE,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
  CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS,
  CONTACT_ACTIVITY_SORT_SELECT_OPTIONS,

  EVENT_ATTENDEES_STATUS,
  EVENT_ATTENDEES_MAPPING,
}
