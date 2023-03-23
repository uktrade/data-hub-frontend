const ARCHIVED = 'Archived'
const NOT_ARCHIVED = 'Not Archived'
const YES = 'Yes'
const NO = 'No'

const CHANGE_TYPE_TEXT = 'business details'

const EXCLUDED_FIELDS = ['archived_by', 'archived_on', 'dnb_modified_on']

const COMPANY_FIELD_NAME_TO_LABEL_MAP = {
  address_1: 'Address line 1',
  address_2: 'Address line 2 (optional)',
  archived_documents_url_path: 'Archived documents URL path',
  company_number: 'Companies House number',
  description: 'Business description (optional)',
  export_experience_category: 'Export win category',
  export_to_countries: 'Countries currently exporting to',
  future_interest_countries: 'Future countries of interest',
  global_ultimate_duns_number: 'Global Ultimate Duns Number',
  great_profile_status: 'great.gov.uk business profile',
  is_turnover_estimated: 'Is turnover estimated',
  name: 'Name of company',
  number_of_employees: 'Number of employees (optional)',
  one_list_account_owner: 'Global Account Manager - One List',
  one_list_tier: 'One List tier',
  pending_dnb_investigation: 'Pending D&B investigation',
  registered_address_1: 'Registered address line 1',
  registered_address_2: 'Registered address line 2',
  sector: 'DBT sector',
  trading_names: 'Trading name(s)',
  uk_region: 'DBT region',
  uk_based: 'UK based',
  vat_number: 'VAT number (optional)',
  website: "Company's website (optional)",
}

const AUTOMATIC_UPDATE = 'automaticUpdate'
const NOT_SET = 'Not set'

module.exports = {
  ARCHIVED,
  NOT_ARCHIVED,
  YES,
  NO,
  AUTOMATIC_UPDATE,
  CHANGE_TYPE_TEXT,
  EXCLUDED_FIELDS,
  COMPANY_FIELD_NAME_TO_LABEL_MAP,
  NOT_SET,
}
