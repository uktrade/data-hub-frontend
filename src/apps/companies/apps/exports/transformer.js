/* eslint-disable camelcase */
const { flatMap } = require('lodash')

const { getDataLabels } = require('../../../../lib/controller-utils')
const urls = require('../../../../lib/urls')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')
const groupExportCountries = require('../../../../lib/group-export-countries')

function getCountries(data) {
  return flatMap(data, ({ name }) => name || null).join(', ') || 'None'
}

function getExportPotentialLabel(key) {
  const item = exportPotentialLabels[key]

  return (item && item.text) || 'No score given'
}

function getGreatProfileValue(profileStatus, companiesHouseNumber) {
  if (profileStatus === 'published') {
    return {
      url: urls.external.greatProfile(companiesHouseNumber),
      newWindow: true,
      name: '"Find a supplier" profile',
      hint: '(opens in a new window)',
    }
  }
  return profileStatus === 'unpublished'
    ? 'Profile not published'
    : 'No profile'
}

function getCountriesFields(company, useNewCountries) {
  if (useNewCountries) {
    const buckets = groupExportCountries(company.export_countries)

    return {
      exportToCountries: getCountries(
        buckets[EXPORT_INTEREST_STATUS.EXPORTING_TO]
      ),
      futureInterestCountries: getCountries(
        buckets[EXPORT_INTEREST_STATUS.FUTURE_INTEREST]
      ),
      noInterestCountries: getCountries(
        buckets[EXPORT_INTEREST_STATUS.NOT_INTERESTED]
      ),
    }
  }
  return {
    exportToCountries: getCountries(company.export_to_countries),
    futureInterestCountries: getCountries(company.future_interest_countries),
  }
}

module.exports = function transformCompanyToExportDetailsView(
  company,
  useNewCountries
) {
  const labels = {
    ...exportDetailsLabels,
  }
  const viewRecord = {
    exportExperienceCategory: company.export_experience_category || 'None',
    ...getCountriesFields(company, useNewCountries),
    exportPotential: getExportPotentialLabel(company.export_potential),
    greatProfile: getGreatProfileValue(
      company.great_profile_status,
      company.company_number
    ),
  }

  // Whilst we have the feature flag we have to delete the new label
  // Otherwise a new field will be displayed with no value
  // @TODO remove this when the feature flag is removed
  if (!useNewCountries) {
    delete labels.noInterestCountries
  }

  return getDataLabels(viewRecord, labels)
}
