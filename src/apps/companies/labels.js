const companyDetailsLabels = {
  business_type: 'Business type',
  name: 'Name',
  registered_address: 'Registered address',
  trading_names: 'Trading names',
  address: 'Address',
  uk_region: 'UK region',
  headquarter_type: 'Headquarter type',
  global_headquarters: 'Global HQ',
  ultimate_hq: 'Ultimate HQ',
  sector: 'Sector',
  website: 'Website',
  description: 'Business description',
  employee_range: 'Number of employees',
  turnover_range: 'Annual turnover',
  subsidiaries: 'Subsidiaries',
  link_a_subsidiary: 'Link a subsidiary',
  link_subsidiary: 'Link subsidiary',
  country: 'Country',
  business_type_for_other: 'Type of organisation',
  business_type_uk_other: 'Type of organisation',
  archived: 'Archived status',
  archived_on: 'Archive date',
  archived_reason: 'Archived reason',
  archived_by_id: 'Archived by',
  company_number: 'Companies House number',
  vat_number: 'VAT number',
  reference_code: 'CDMS reference',
}

const address = {
  companyAddress: 'Address',
  companyRegisteredAddress: 'Registered address',
  companiesHouseRegisteredAddress: 'Registered address',
}

const companyTypeOptions = {
  ltd: 'UK private or public limited company',
  ukother: 'Other type of UK organisation',
  foreign: 'Foreign organisation',
}

const hqLabels = {
  ehq: 'European HQ',
  ghq: 'Global HQ',
  ukhq: 'UK HQ',
  trading_names: 'Trading names',
}

const accountManagementDisplayLabels = {
  one_list_tier: 'One List tier',
  one_list_group_global_account_manager: 'Global Account Manager',
}

const exportDetailsLabels = {
  exportExperienceCategory: 'Export win category',
  exportToCountries: 'Currently exporting to',
  futureInterestCountries: 'Future countries of interest',
  noInterestCountries: 'Countries of no interest',
  greatProfile: 'great.gov.uk business profile',
  exportPotential: 'Export potential',
}

const coreTeamLabels = {
  region: 'Region',
  country: 'Country',
  team: 'Team',
  location: 'Location',
  global_account_manager: 'Global Account Manager',
  adviser_on_core_team: 'Adviser on core team',
}

const aboutLabels = {
  business_type: 'Business type',
  trading_names: 'Trading names',
  company_number: 'Companies House number',
  vat_number: 'VAT number',
  reference_code: 'CDMS reference',
  turnover: 'Annual turnover',
  number_of_employees: 'Number of employees',
  website: 'Website',
  description: 'Description',
}

const businessHierarchyLabels = {
  headquarter_type: 'Headquarter type',
  subsidiaries: 'Subsidiaries',
  global_headquarters: 'Global HQ',
}

const exportPotentialLabels = {
  very_high: {
    text: 'Very High',
    description: 'Most companies like this one are exporters',
  },
  high: {
    text: 'High',
    description: 'This business shares some features with successful exporters',
  },
  medium: {
    text: 'Medium',
    description: "Some businesses that look like this one export, others don't",
  },
  low: {
    text: 'Low',
    description:
      'This business shares many features with companies that do not export',
  },
  very_low: {
    text: 'Very Low',
    description: "Most of the businesses like this aren't exporters",
  },
}

const exportSegmentsLabels = {
  hep: 'High export potential',
  'non-hep': 'Not high export potential',
}
const exportSubSegmentsLabels = {
  sustain_nurture_and_grow: 'Sustain: nurture & grow',
  sustain_develop_export_capability: 'Sustain: develop export capability',
  sustain_communicate_benefits: 'Sustain: communicate benefits',
  sustain_increase_competitiveness: 'Sustain: increase competitiveness',
  reassure_nurture_and_grow: 'Reassure: nurture & grow',
  reassure_develop_export_capability: 'Reassure: develop export capability',
  reassure_leave_be: 'Reassure: leave be',
  reassure_change_the_game: 'Reassure: change the game',
  promote_develop_export_capability: 'Promote: develop export capability',
  promote_communicate_benefits: 'Promote: communicate benefits',
  promote_change_the_game: 'Promote: change the game',
  challenge: 'Challenge',
}

module.exports = {
  companyDetailsLabels,
  companyTypeOptions,
  hqLabels,
  accountManagementDisplayLabels,
  exportDetailsLabels,
  address,
  coreTeamLabels,
  aboutLabels,
  businessHierarchyLabels,
  exportPotentialLabels,
  exportSegmentsLabels,
  exportSubSegmentsLabels,
}
