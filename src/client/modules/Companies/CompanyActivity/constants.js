import { TAG_COLOURS } from '../../../components/Tag/index'

export const LABELS = {
  activityType: 'Activity type',
  interaction: 'Interaction',
  serviceDelivery: 'Service delivery',
  advisers: 'Adviser',
  company: 'Company',
  subject: 'Subject',
  createdBy: 'Created by',
  me: 'Me',
  others: 'Others',

  dateAfter: 'From',
  dateBefore: 'To',
  service: 'Service',
  teams: 'Teams',
  sector: 'Sector',
  businessIntelligence: 'Business intelligence',
  policyAreas: 'Policy areas',
  policyIssueType: 'Policy issue type',
  companyOneListGroupTier: 'Company One List group tier',
  allDataHubActivity: 'Internal activity',
  myActivity: 'My activity',
  allExternalActivity: 'External activity',
}

export const TAGS = {
  REFERRAL: {
    COMPLETE: {
      text: 'Completed referral',
      colour: 'green',
    },
    OUTSTANDING: {
      text: 'Outstanding referral',
      colour: 'blue',
    },
  },
  ACTIVITY_LABELS: {
    KIND: TAG_COLOURS.GREY,
    THEME: TAG_COLOURS.GOV_BLUE,
    SERVICE: TAG_COLOURS.BLUE,
  },
}

const FILTER_KEYS = {
  dataHubAndExternalActivity: 'dataHubAndExternalActivity',
  myActivity: 'myActivity',
  externalActivity: 'externalActivity',
  dataHubActivity: 'dataHubActivity',
}

export const ACTIVITY_TYPE_OPTIONS = [
  { label: LABELS.allDataHubActivity, value: FILTER_KEYS.dataHubActivity },
  { label: LABELS.allExternalActivity, value: FILTER_KEYS.externalActivity },
]

export const SORT_OPTIONS = [
  { value: 'date:desc', name: 'Recently created' },
  { value: 'date:asc', name: 'Oldest first' },
]

export const NEW_PROJECT_TAG = {
  text: 'New Investment Project',
  colour: 'grey',
  dataTest: 'investment-kind-label',
}

export const NEW_ORDER_TAG = {
  text: 'New Order',
  colour: 'grey',
  dataTest: 'order-kind-label',
}
