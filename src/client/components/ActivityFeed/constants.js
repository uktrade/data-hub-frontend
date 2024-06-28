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

export const INTERACTION_SERVICES = {
  'Account Management': 'Account Management',
  'A Specific Service': 'Specific Service',
  'A Specific DBT Export Service or Funding': 'Service or Funding',
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
  // Below services with updated capitalisation
  'Account management': 'Account management',
  'Specific service': 'Specific service',
  'DBT export service or funding': 'DBT export service or funding',
  'Enquiry received': 'Enquiry',
  'Enquiry or referral': 'Enquiry or referral',
  'Export win': 'Export win',
  'Global Investment Summit (2021)': 'Global Investment Summit (2021)',
  'Investment Enquiry': 'Enquiry',
  'Investment - IST aftercare offered (IST use only)': 'IST Aftercare',
  'Investment - services': 'Service',
  'IST service': 'IST service',
  'Proposition development': 'Proposition development',
  'Trade agreement implementation activity': 'Implementation',
}

export const INTERACTION_SERVICEOTHER = {
  'Export Support Service - International Markets':
    'Export Support Service: International',
  'Global Growth Service: Diagnostic and Output Report Completed by DBT':
    'Global Growth: Diagnostic and Output Report',
  'Global Growth Service: engagement letter signed by company':
    'Global Growth: Engagement Letter Signed',
  'Global Growth Service: project closed': 'Global Growth: Project Closed',
  'Global Growth Service: signed export growth plan received from company':
    'Global Growth: Export Growth Plan Received',
  'Overseas Business Network chargeable services (OBN)':
    'OBN Chargeable Services',
  'Participation at Glasgow/getting involved with COP26':
    'Participation at Glasgow/COP26 involvement',
  'DBT Middle East & Pakistan Comms & Marketing campaigns':
    'DBT Middle East & Pakistan Comms & Marketing',
  'Commonwealth Games 2022 - BATP Programme': 'Commonwealth Games 2022 – BATP',
  'Commonwealth Games 2022 - GEP Programme': 'Commonwealth Games 2022 – GEP',
  'HPO High Potential Opportunity investment enquiry from IIGB':
    'HPO Investment Enquiry via IIGB',
  'HPO High Potential Opportunity investment enquiry from IST target company':
    'HPO Investment Enquiry via IST Target Company',
  'Abandoned - no investor response (ERU Use)':
    'Abandoned - No Response (ERU Use)',
  'Follow up email - no investor response (ERU Use)':
    'Follow Up Email - No Response (ERU Use)',
  'Business partners (such as distributors or manufacturers)':
    'Business Partners',
  'Financial and professional service providers':
    'Financial + Professional Service Providers',
  'Engagement with Local Enterprise Partnerships (LEPs)':
    'Engagement: Local Enterprise Partnerships',
  'Engaging with devolved authorities on trade agreements':
    'Engagement: Devolved Authorities Trade Agreements',
  'Informing key stakeholder groups of opportunities and gathering business intelligence':
    'Informing stakeholders + gathering intelligence',
  'Negotiating rounds - pre-ratification and negotiating amendments':
    'Negotiating: pre-ratification + amendments',
  'One-to-one with exporters explaining new trade agreement opportunities, messages and resources':
    '121 with exporters: new trade agreement opportunities',
  'One-to-one with investors explaining new trade agreement opportunities, messages and resources':
    '121 with investors: new trade agreement opportunities',
  'Partner country interaction - post-ratification (trade agreement related)':
    'Partner country interaction: post-ratification',
  'Partner country interaction - related to Market Access Barriers':
    'Partner country interaction: Market Access Barriers',
}

export default {
  ACTIVITY_TYPE,
  SOURCE_TYPES,
  STATUS,
  BADGES,
  INTERACTION_SERVICES,
  INTERACTION_SERVICEOTHER,
}
