const { concat } = require('lodash')
const { root } = require('./paths')

const { INVESTMENT_LINK_PARAM } = require('../../common/constants')

const GLOBAL_NAV_ITEM = {
  path: root,
  headerKey: 'datahub-investments',
  permissions: [
    'investment.view_associated_investmentproject',
    'investment.view_all_investmentproject',
  ],
  key: 'datahub-crm',
  order: 5,
}

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Project details',
  },
  {
    path: 'team',
    label: 'Project team',
    data: {
      test: 'project-team',
    },
  },
  {
    path: 'interactions' + INVESTMENT_LINK_PARAM,
    label: 'Interactions',
    permissions: [
      'interaction.view_associated_investmentproject_interaction',
      'interaction.view_all_interaction',
    ],
    ariaDescription: 'Investment interactions',
  },
  {
    path: 'propositions' + INVESTMENT_LINK_PARAM,
    label: 'Propositions',
    permissions: [
      'proposition.view_associated_investmentproject_proposition',
      'proposition.view_all_proposition',
      'proposition.view_associated_proposition',
    ],
  },
  {
    path: 'evaluation',
    label: 'Evaluations',
  },
  {
    path: 'edit-history',
    label: 'Edit history',
  },
  {
    path: 'documents',
    label: 'CDMS documents',
    permissions: ['investment.view_investmentproject_document'],
  },
  {
    path: 'evidence',
    label: 'Evidence',
  },
  {
    path: 'admin',
    label: 'Admin',
    permissions: ['investment.change_to_any_stage_investmentproject'],
  },
]

const INVESTMENT_TAB_ITEMS = [
  {
    path: 'projects/?page=1&sortby=created_on:desc',
    label: 'Projects',
  },
  {
    path: 'profiles',
    label: 'Investor profiles',
  },
  {
    path: 'opportunities',
    label: 'UK opportunities',
  },
]

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)

const LARGE_INVESTMENT_PROFILE_QUERY_FIELDS = [
  'link',
  'investor_company__name',
  'investor_type__name',
  'investable_capital',
  'global_assets_under_management',
  'investor_description',
  'required_checks_conducted__name',
  'required_checks_conducted_by_name',
  'required_checks_conducted_on',
  'deal_ticket_sizes_names',
  'asset_classes_of_interest_names',
  'investment_types_names',
  'minimum_return_rate__name',
  'time_horizons_names',
  'restrictions_names',
  'construction_risks_names',
  'minimum_equity_percentage__name',
  'desired_deal_roles_names',
  'uk_region_locations_names',
  'other_countries_being_considered_names',
  'notes_on_locations',
]

const LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS = [
  'link',
  'name',
  'description',
  'type__name',
  'status__name',
  'uk_region_locations_names',
  'promoter_names',
  'lead_dit_relationship_manager_name',
  'other_dit_contact_names',
  'required_checks_conducted__name',
  'required_checks_conducted_by_name',
  'required_checks_conducted_on',
  'asset_class_names',
  'opportunity_value_type__name',
  'opportunity_value',
  'construction_risks_names',
  'total_investment_sought',
  'current_investment_secured',
  'investment_type_names',
  'estimated_return_rate__name',
  'time_horizons_names',
  'sources_of_funding_names',
  'dit_support_provided',
  'funding_supporting_details',
  'reasons_for_abandonment_names',
  'why_abandoned',
  'why_suspended',
]

const LARGE_INVESTMENT_PROFILE_QUERY_DATE = ['modified_on', 'created_on']

const LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE = ['modified_on', 'created_on']

const QUERY_FIELDS = [
  'status',
  'adviser',
  'sector_descends',
  'investor_company_country',
  'uk_region_location',
  'stage',
  'investment_type',
  'investor_company',
  'proposal_deadline_before',
  'proposal_deadline_after',
  'client_relationship_manager',
  'likelihood_to_land',
  'level_of_involvement_simplified',
  'country_investment_originates_from',
  'land_date_financial_year_start',
]

const QUERY_DATE_FIELDS = [
  'estimated_land_date_before',
  'estimated_land_date_after',
  'actual_land_date_before',
  'actual_land_date_after',
  'client_relationship_manager',
  'likelihood_to_land',
]

const CHANGE_TYPE_TEXT = 'the project'
const TRUE = 'True'
const FALSE = 'False'
const NOT_SET = 'Not set'

// TODO: When receive list of updated edit-history fields from users,
// add EXCLUDED_FIELDS, FIELD_NAME_TO_LABEL_MAP

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  INVESTMENT_TAB_ITEMS,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
  CHANGE_TYPE_TEXT,
  TRUE,
  FALSE,
  NOT_SET,
  LARGE_INVESTMENT_PROFILE_QUERY_FIELDS,
  LARGE_INVESTMENT_PROFILE_QUERY_DATE,
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE,
}
