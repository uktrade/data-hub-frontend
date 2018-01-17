const { assign, filter, includes } = require('lodash')

const { getOptions } = require('../../lib/options')

const ukOtherBusinessTypeWhitelist = {
  charity: '9dd14e94-5d95-e211-a939-e4115bead28a',
  governmentDepartment: '9cd14e94-5d95-e211-a939-e4115bead28a',
  intermediary: '9bd14e94-5d95-e211-a939-e4115bead28a',
  limitedPartnership: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
  partnership: '9ad14e94-5d95-e211-a939-e4115bead28a',
  soleTrader: '99d14e94-5d95-e211-a939-e4115bead28a',
  ukBranchOfForeignCompany: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
}

const foreignOtherBusinessTypeWhitelist = assign({}, ukOtherBusinessTypeWhitelist, {
  company: '98d14e94-5d95-e211-a939-e4115bead28a',
})

const buildBusinessTypeOptions = async (token, whitelist) => {
  const businessTypeOptions = await getOptions(token, 'business-type')
  return filter(businessTypeOptions, (businessTypeOption) => {
    return includes(whitelist, businessTypeOption.value)
  })
}

const buildUkOtherCompanyOptions = async (token) => {
  return buildBusinessTypeOptions(token, ukOtherBusinessTypeWhitelist)
}

const buildForeignOtherCompanyOptions = async (token) => {
  return buildBusinessTypeOptions(token, foreignOtherBusinessTypeWhitelist)
}

module.exports = {
  buildUkOtherCompanyOptions,
  buildForeignOtherCompanyOptions,
}
