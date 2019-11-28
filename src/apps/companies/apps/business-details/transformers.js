/* eslint-disable camelcase */

const { get, pick, compact, omitBy } = require('lodash')
const { hqLabels } = require('../../labels')
const config = require('../../../../config')

const transformGlobalAccountManager = ({ dit_team, name }) => {
  const region = get(dit_team, 'uk_region.name')
  const country = get(dit_team, 'country.name')
  const items = compact([
    name,
    get(dit_team, 'name'),
    region || country,
  ])

  return items.length ? items : 'Not set'
}

const transformCompanyToBusinessDetails = (company) => {
  return omitBy({
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
      'archived',
      'archived_on',
      'archived_by',
      'archived_reason',
      'uk_based',
      'global_headquarters',
      'headquarter_type',
    ]),
    turnover: company.turnover && company.turnover * config.currencyRate.usdToGbp,
    archived_on: company.archived_on,
    business_type: get(company.business_type, 'name'),
    turnover_range: get(company.turnover_range, 'name'),
    employee_range: get(company.employee_range, 'name'),
    sector: get(company.sector, 'name'),
    uk_region: get(company.uk_region, 'name'),
    one_list_group_tier: get(company.one_list_group_tier, 'name'),
    one_list_group_global_account_manager: company.one_list_group_tier && transformGlobalAccountManager(company.one_list_group_global_account_manager),
    headquarter_type_label: company.headquarter_type && hqLabels[company.headquarter_type.name],
  }, x => !x)
}

module.exports = {
  transformCompanyToBusinessDetails,
}
