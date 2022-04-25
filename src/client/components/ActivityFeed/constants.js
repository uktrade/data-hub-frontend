import { RED, GREEN, BLUE } from 'govuk-colours'

export const STATUS = {
  DRAFT: 'draft',
  COMPLETE: 'complete',
  UPCOMING: 'upcoming',
  INCOMPLETE: 'incomplete',
  CANCELLED: 'cancelled',
}

export const BADGES = {
  INTERACTION: {
    COMPLETE: {
      text: 'Interaction',
      borderColour: GREEN,
    },
    UPCOMING: {
      text: 'Upcoming interaction',
      borderColour: BLUE,
    },
    INCOMPLETE: {
      text: 'Incomplete interaction',
      borderColour: BLUE,
    },
    CANCELLED: {
      text: 'Cancelled interaction',
      borderColour: RED,
    },
    SERVICE_DELIVERY: {
      text: 'Service delivery',
      borderColour: GREEN,
    },
  },
  REFERRAL: {
    COMPLETE: {
      text: 'Completed referral',
      borderColour: GREEN,
    },
    OUTSTANDING: {
      text: 'Outstanding referral',
      borderColour: BLUE,
    },
  },
}

export const SOURCE_TYPES = {
  external: 'externalDataSource',
}

export const ACTIVITY_TYPE = {
  AventriAttendee: ['dit:aventri:Attendee'],
  CompaniesHouseAccount: ['dit:Accounts'],
  CompaniesHouseCompany: ['dit:Company'],
  HmrcExporter: ['dit:Export'],
  Interaction: ['dit:Interaction', 'dit:ServiceDelivery'],
  InvestmentProject: ['dit:InvestmentProject'],
  Omis: ['dit:OMISOrder'],
  Referral: ['dit:CompanyReferral'],
  DirectoryFormsApi: ['dit:directoryFormsApi:Submission'],
  MaxemailCampaign: ['dit:maxemail:Campaign'],
}

export const ACTIVITY_TYPE_FILTERS = {
  dataHubAndExternalActivity: {
    label: 'All Data Hub & external activity',
    value: 'dataHubAndExternalActivity',
  },
  myActivity: {
    label: 'My activity',
    value: 'myActivity',
  },
  externalActivity: {
    label: 'All external activity',
    value: 'externalActivity',
  },
  dataHubActivity: {
    label: 'All Data Hub activity',
    value: 'dataHubActivity',
  },
}

export const INTERACTION_SERVICES = {
  'Account Management': 'Account Management',
  'A Specific Service': 'Specific Service',
  'A Specific DIT Export Service or Funding': 'Service or Funding',
  COP26: 'COP26',
  'Enquiry received': 'Enquiry',
  'Enquiry or Referral Received': 'Enquiry or Referral',
  Events: 'Event',
  'Export Win': 'Export Win',
  'Global Investment Summit (2021)': 'Global Investment Summit (2021)',
  'Investment Enquiry': 'Enquiry',
  'Investment - IST Aftercare Offered (IST use only)': 'IST Aftercare',
  'Investment - Services': 'Service',
  'IST Specific Service': 'IST Service',
  'Proposition Development': 'Proposition Development',
  'Trade Agreement Implementation Activity': 'Implementation',
}

export default {
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_FILTERS,
  SOURCE_TYPES,
  STATUS,
  BADGES,
  INTERACTION_SERVICES,
}
