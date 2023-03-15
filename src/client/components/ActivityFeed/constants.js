import { RED, GREEN, BLUE } from '../../../client/utils/colours'

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
  DataHubEvent: ['dit:dataHub:Event'],
  AventriEvent: ['dit:aventri:Event'],
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

export const ANALYTICS_ACCORDION_TYPE = {
  HMRC: 'HMRC',
  COMPANIES_HOUSE: 'Companies House',
  DATA_HUB_ACTIVITY: 'Data Hub Activity',
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
  'GREAT - Unicorn Kingdom Campaign - North America (2023)':
    'GREAT - Unicorn Kingdom Campaign',
}

export const INTERACTION_SERVICEOTHER = {
  'Export Support Service - International Markets':
    'Export Support Service: International',
  'Global Growth Service: Diagnostic and Output Report Completed by DIT':
    'Global Growth: Diagnostic and Output Report',
  'Global Growth Service: Engagement Letter Signed by Company':
    'Global Growth: Engagement Letter Signed',
  'Global Growth Service: Project Closed': 'Global Growth: Project Closed',
  'Global Growth Service: Signed Export Growth Plan Received from Company':
    'Global Growth: Export Growth Plan Received',
  'Overseas Business Network Chargeable Services (OBN)':
    'OBN Chargeable Services',
  'Participation at Glasgow/getting involved with COP26':
    'Participation at Glasgow/COP26 involvement',
  'DIT Middle East & Pakistan Comms & Marketing campaigns':
    'DIT Middle East & Pakistan Comms & Marketing',
  'Commonwealth Games 2022 - BATP Programme': 'Commonwealth Games 2022 – BATP',
  'Commonwealth Games 2022 - GEP Programme': 'Commonwealth Games 2022 – GEP',
  'HPO High Potential Opportunity Investment Enquiry via IIGB':
    'HPO Investment Enquiry via IIGB',
  'HPO High Potential Opportunity Investment Enquiry via IST Target Company':
    'HPO Investment Enquiry via IST Target Company',
  'Abandoned - No Investor Response (ERU Use)':
    'Abandoned - No Response (ERU Use)',
  'Follow Up Email - No Investor Response (ERU Use)':
    'Follow Up Email - No Response (ERU Use)',
  'Business Partners (e.g. distributors or manufacturers)': 'Business Partners',
  'Financial and Professional Service Providers':
    'Financial + Professional Service Providers',
  'Engagement with Local Enterprise Partnerships':
    'Engagement: Local Enterprise Partnerships',
  'Engaging with Devolved Authorities on Trade Agreements':
    'Engagement: Devolved Authorities Trade Agreements',
  'Informing key stakeholder groups of opportunities & gathering business intelligence':
    'Informing stakeholders + gathering intelligence',
  'Negotiating rounds - pre-ratification and negotiating amendments':
    'Negotiating: pre-ratification + amendments',
  'One-to-one with exporters explaining new trade agreement opportunities, messages and resources':
    '121 with exporters: new trade agreement opportunities',
  'One-to-one with investors explaining new trade agreement opportunities, messages and resources':
    '121 with investors: new trade agreement opportunities',
  'Partner country interaction - post-ratification (Trade Agreement related)':
    'Partner country interaction: post-ratification',
  'Partner country interaction - related to Market Access Barriers':
    'Partner country interaction: Market Access Barriers',
}

export default {
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_FILTERS,
  ANALYTICS_ACCORDION_TYPE,
  SOURCE_TYPES,
  STATUS,
  BADGES,
  INTERACTION_SERVICES,
  INTERACTION_SERVICEOTHER,
}
