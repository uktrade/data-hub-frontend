/* eslint-disable camelcase */
const { assign, get, isPlainObject } = require('lodash')

function transformUKCompany (data) {
  if (isPlainObject(data.uk_company)) {
    return {
      name: data.uk_company.name,
      actions: [{
        label: 'Edit company',
        url: `/investment-projects/${data.id}/edit-ukcompany?term=${encodeURIComponent(data.uk_company.name)}`,
      }, {
        label: 'Remove company',
        url: `/investment-projects/${data.id}/remove-ukcompany`
        ,
      }],
    }
  }

  return {
    name: 'Find company',
    url: `/investment-projects/${data.id}/edit-ukcompany`,
  }
}

function transformInvestmentRequirementsForView (data) {
  if (!isPlainObject(data)) { return }

  const strategicDrivers = get(data, 'strategic_drivers', [])
  const competitorCountries = get(data, 'competitor_countries', [])
  const regionLocations = get(data, 'uk_region_locations', [])
  const uk_company = transformUKCompany(data)

  return assign({}, data, {
    strategic_drivers: strategicDrivers.map(driver => driver.name).join(', '),
    competitor_countries: competitorCountries.map(country => country.name).join(', '),
    uk_region_locations: regionLocations.map(region => region.name).join(', '),
    uk_company,
  })
}

module.exports = { transformInvestmentRequirementsForView }
