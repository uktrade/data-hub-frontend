/* eslint-disable camelcase */
const { get, pick, compact, omitBy } = require('lodash')
const { hqLabels } = require('../../labels')
const { convertUsdToGbp } = require('../../../../common/currency')

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
        'segment',
        'sub_segment',
      ]),
      turnover: convertUsdToGbp(company.turnover),
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

module.exports = {
  transformCompanyToBusinessDetails,
}
