const FILTER_FEED_TYPE = {
  ALL: 'all',
  RECENT: 'recent',
  UPCOMING: 'upcoming',
}

const CONTACT_ACTIVITY_SORT_SELECT_OPTIONS = [
  { name: 'Newest', value: 'date:desc' },
  { name: 'Oldest', value: 'date:asc' },
]

const EVENT_ATTENDEES_STATUS = {
  registered: 'Registered',
  waitingList: 'Waiting list',
  didNotAttend: 'Did not attend',
  attended: 'Attended',
  cancelled: 'Cancelled',
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

module.exports = {
  FILTER_FEED_TYPE,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  CONTACT_ACTIVITY_SORT_SELECT_OPTIONS,
  EVENT_ATTENDEES_STATUS,
}
