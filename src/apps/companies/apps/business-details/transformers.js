/* eslint-disable camelcase */
const { get, pick, compact, omitBy } = require('lodash')
const { hqLabels } = require('../../labels')

const transformGlobalAccountManager = (globalAccountManager) => {
  if (!globalAccountManager) {
    return null
  }
  const { dit_team, name } = globalAccountManager
  const region = get(dit_team, 'uk_region.name')
  const country = get(dit_team, 'country.name')
  const items = compact([name, get(dit_team, 'name'), region || country])
  return items.length ? items : null
}

const transformCompanyToBusinessDetails = (company) => {
  return omitBy(
    {
      ...pick(company, [
        'id',
        'address',
        'description',
        'registered_address',
        'name',
        'vat_number',
        'reference_code',
        'duns_number',
        'trading_names',
        'company_number',
        'is_turnover_estimated',
        'number_of_employees',
        'is_number_of_employees_estimated',
        'website',
        'created_on',
        'modified_on',
        'dnb_modified_on',
        'archived',
        'archived_on',
        'archived_by',
        'archived_reason',
        'uk_based',
        'headquarter_type',
        'is_global_ultimate',
        'export_segment',
        'export_sub_segment',
      ]),
      turnover: company.turnover_gbp,
      business_type: get(company.business_type, 'name'),
      turnover_range: get(company.turnover_range, 'name'),
      employee_range: get(company.employee_range, 'name'),
      sector: get(company.sector, 'name'),
      uk_region: get(company.uk_region, 'name'),
      global_headquarters: get(company.global_headquarters, 'name'),
      one_list_group_tier: get(company.one_list_group_tier, 'name'),
      one_list_group_global_account_manager: transformGlobalAccountManager(
        company.one_list_group_global_account_manager
      ),
      headquarter_type_label:
        company.headquarter_type && hqLabels[company.headquarter_type.name],
    },
    (x) => !x
  )
}

const transformDynamicCompanyToBusinessDetails = (company) => {
  return omitBy(
    {
      ...pick(company, [
        'id',
        'address',
        'registered_address',
        'name',
        'duns_number',
        'is_turnover_estimated',
        'is_number_of_employees_estimated',
        'website',
        'created_on',
        'modified_on',
        'dnb_modified_on',
        'archived',
        'archived_on',
        'archived_by',
        'archived_reason',
        'uk_based',
        'headquarter_type',
        'is_global_ultimate',
      ]),

      // Section About
      about: {
        vat_number: { label: 'VAT number', value: company?.vat_number },
        business_type: {
          label: 'Business type',
          value: company?.business_type,
        },
        trading_names: { label: 'Trading name', value: company?.trading_names },
        reference_code: {
          label: 'CDMS reference',
          value: company?.reference_code,
        },
        company_number: {
          label: 'Companies House number',
          value: company?.company_number,
        },
        turnover: { label: 'Annual turnover', value: company?.turnover_gbp },
        number_of_employees: {
          label: 'Number of employees',
          value: company?.number_of_employees,
        },
        website: { label: 'Website', value: company?.website },
        contactNumber: {
          label: 'Contact Number',
          value: company?.contact_number,
        },
        description: {
          label: 'Business description',
          value: company?.description,
        },
        export_segment: { label: 'Segment', value: company?.export_segment },
        export_sub_segment: {
          label: 'Sub-segment',
          value: company?.export_sub_segment,
        },
        export_sub_segment2: {
          label: 'Sub-segment2',
          value: company?.export_sub_segment2,
        },
      },

      turnover_range: get(company.turnover_range, 'name'),
      employee_range: get(company.employee_range, 'name'),
      sector: get(company.sector, 'name'),
      uk_region: get(company.uk_region, 'name'),
      global_headquarters: get(company.global_headquarters, 'name'),
      one_list_group_tier: get(company.one_list_group_tier, 'name'),
      one_list_group_global_account_manager: transformGlobalAccountManager(
        company.one_list_group_global_account_manager
      ),
      headquarter_type_label:
        company.headquarter_type && hqLabels[company.headquarter_type.name],
    },
    (x) => !x
  )
}

module.exports = {
  transformCompanyToBusinessDetails,
  transformDynamicCompanyToBusinessDetails,
}
