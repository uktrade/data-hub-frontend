const { filter, map, includes, sortBy } = require('lodash')

const { getOptions } = require('../../../../lib/options')

const COMPANY_LABEL = 'Company'
const LIMITED_COMPANY_LABEL = 'Limited company'
const BUSINESS_TYPE_WHITELIST = {
  charity: '9dd14e94-5d95-e211-a939-e4115bead28a',
  company: '98d14e94-5d95-e211-a939-e4115bead28a',
  governmentDepartmentOrOtherPublicBody: '9cd14e94-5d95-e211-a939-e4115bead28a',
  limitedPartnership: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
  partnership: '9ad14e94-5d95-e211-a939-e4115bead28a',
  soleTrader: '99d14e94-5d95-e211-a939-e4115bead28a',
}

async function fetchOrganisationTypes(req) {
  const businessTypeOptions = await getOptions(req, 'business-type')
  const filteredBusinessTypeOptions = filter(
    businessTypeOptions,
    ({ value }) => {
      return includes(BUSINESS_TYPE_WHITELIST, value)
    }
  )

  return sortBy(
    map(filteredBusinessTypeOptions, (businessTypeOption) => {
      if (businessTypeOption.label === COMPANY_LABEL) {
        return {
          ...businessTypeOption,
          label: LIMITED_COMPANY_LABEL,
        }
      }

      return businessTypeOption
    }),
    'label'
  )
}

module.exports = {
  fetchOrganisationTypes,
}
