/* eslint-disable camelcase */
const { castArray, get, isEmpty, isPlainObject, map } = require('lodash')
const { format } = require('../../../client/utils/date')

const { getInvestmentTypeDetails } = require('./shared')

function transformInvestmentForView({
  business_activities,
  other_business_activity,
  investment_type,
  fdi_type,
  sector,
  client_contacts,
  description,
  anonymous_description,
  investor_company,
  investor_type,
  level_of_involvement,
  specific_programme,
  estimated_land_date,
  actual_land_date,
  likelihood_to_land,
} = {}) {
  function transformClientContacts(contacts) {
    return map(contacts, ({ name, id }) => {
      return {
        name,
        url: `/contacts/${id}`,
      }
    })[0]
  }
  const businessActivities = castArray(business_activities).map((i) => i.name)
  if (!isEmpty(other_business_activity)) {
    businessActivities.push(other_business_activity)
  }

  return {
    investor_company: isPlainObject(investor_company)
      ? {
          name: get(investor_company, 'name'),
          url: `/companies/${investor_company.id}`,
        }
      : null,
    investment_type: getInvestmentTypeDetails(investment_type, fdi_type),
    sector,
    business_activities: businessActivities.join(', '),
    client_contacts: !isEmpty(client_contacts)
      ? transformClientContacts(client_contacts)
      : null,
    description,
    anonymous_description,
    investor_type,
    level_of_involvement,
    specific_programme,
    estimated_land_date: !isEmpty(estimated_land_date)
      ? format(estimated_land_date, 'MMMM yyyy')
      : null,
    likelihood_to_land,
    actual_land_date: !isEmpty(actual_land_date)
      ? {
          type: 'date',
          name: actual_land_date,
        }
      : null,
  }
}

function transformBriefInvestmentSummary(data) {
  if (!isPlainObject(data)) {
    return
  }

  const investorCompany = data.investor_company
  const competitorCountries = data.competitor_countries || []
  const regionLocations = data.uk_region_locations || []

  return {
    sector: get(data, 'sector.name', null),
    investor_company: {
      name: investorCompany.name,
      url: `/companies/${investorCompany.id}`,
    },
    website: investorCompany.website
      ? {
          name: investorCompany.website,
          url: investorCompany.website,
        }
      : null,
    account_tier:
      investorCompany.one_list_group_tier &&
      investorCompany.one_list_group_tier !== null &&
      investorCompany.one_list_group_tier.name
        ? investorCompany.one_list_group_tier.name
        : 'None',
    uk_region_locations: regionLocations
      .map((region) => region.name)
      .join(', '),
    competitor_countries: competitorCountries
      .map((country) => country.name)
      .join(', '),
    estimated_land_date: !isEmpty(data.estimated_land_date)
      ? format(data.estimated_land_date, 'MMMM yyyy')
      : null,
    total_investment: data.total_investment
      ? {
          type: 'currency',
          name: data.total_investment,
        }
      : null,
  }
}

module.exports = {
  transformInvestmentForView,
  transformBriefInvestmentSummary,
}
