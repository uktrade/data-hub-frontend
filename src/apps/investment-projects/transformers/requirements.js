/* eslint-disable camelcase */
const { isPlainObject, map } = require('lodash')

function transformUKCompany (investmentId, ukCompany) {
  if (!isPlainObject(ukCompany)) {
    return {
      name: 'Find company',
      url: `/investment-projects/${investmentId}/edit-ukcompany`,
    }
  }

  const { name } = ukCompany

  return {
    name,
    actions: [
      {
        label: 'Edit company',
        url: `/investment-projects/${investmentId}/edit-ukcompany?term=${encodeURIComponent(name)}`,
      },
      {
        label: 'Remove company',
        url: `/investment-projects/${investmentId}/remove-ukcompany`,
      },
    ],
  }
}

function transformInvestmentRequirementsForView ({
  actual_uk_regions,
  client_requirements,
  competitor_countries,
  id,
  strategic_drivers,
  uk_company,
  uk_region_locations,
} = {}) {
  return {
    strategic_drivers: map(strategic_drivers, 'name').join(', '),
    client_requirements,
    competitor_countries: map(competitor_countries, 'name').join(', '),
    uk_region_locations: map(uk_region_locations, 'name').join(', '),
    actual_uk_regions: map(actual_uk_regions, 'name').join(', '),
    uk_company: transformUKCompany(id, uk_company),
  }
}

module.exports = { transformInvestmentRequirementsForView }
