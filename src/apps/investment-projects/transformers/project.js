/* eslint-disable camelcase */
const { castArray, get, isEmpty, isPlainObject, mapValues } = require('lodash')
const format = require('date-fns/format')
const moment = require('moment')

const { formatCurrency, getInvestmentTypeDetails } = require('./shared')

function transformToApi (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    'client_relationship_manager': Object,
    'referral_source_adviser': Object,
    'referral_source_activity': Object,
    'referral_source_activity_marketing': Object,
    'referral_source_activity_website': Object,
    'investor_company': Object,
    'investment_type': Object,
    'fdi_type': Object,
    'sector': Object,
    'client_contacts': Array,
    'business_activities': Array,
  }

  const relationshipMgr = body.is_relationship_manager
  if (relationshipMgr !== 'false') {
    body.client_relationship_manager = relationshipMgr
  }

  const referralSource = body.is_referral_source
  if (referralSource !== 'false') {
    body.referral_source_adviser = referralSource
  }

  const formatted = mapValues(schema, (type, key) => {
    const value = body[key]

    if (!value) {
      return
    }

    if (type === Array) {
      if (Array.isArray(value)) {
        return value.map(item => {
          return { id: item }
        })
      }

      return [{ id: value }]
    } else if (type === Boolean) {
      return value === 'true' | false
    }

    return { id: value }
  })

  formatted['estimated_land_date'] = [
    body['estimated_land_date_year'],
    body['estimated_land_date_month'],
    '01',
  ].join('-')

  return Object.assign({}, body, formatted)
}

function transformFromApi (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    'client_relationship_manager': String,
    'referral_source_adviser': String,
    'referral_source_activity': String,
    'referral_source_activity_marketing': String,
    'referral_source_activity_website': String,
    'investor_company': String,
    'investment_type': String,
    'fdi_type': String,
    'sector': String,
    'client_contacts': Array,
    'business_activities': Array,
  }

  const formatted = mapValues(schema, (type, key) => {
    if (type === Array) {
      const items = get(body, key, [])
      const ids = items.map(item => item.id)
      return ids
    } else if (type === Boolean) {
      const value = get(body, key, '')
      return value.toString()
    }
    return get(body, `${key}.id`)
  })

  const date = new Date(body['estimated_land_date'])
  if (date) {
    formatted['estimated_land_date_year'] = date.getFullYear()
    formatted['estimated_land_date_month'] = format(date, 'MM')
  }

  return Object.assign({}, body, formatted)
}

function transformInvestmentDataForView ({
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
} = {}) {
  const businessActivities = castArray(business_activities).map(i => i.name)
  if (!isEmpty(other_business_activity)) {
    businessActivities.push(other_business_activity)
  }

  return {
    investor_company: isPlainObject(investor_company) ? {
      name: get(investor_company, 'name'),
      url: `/companies/${investor_company.id}`,
    } : null,
    investment_type: getInvestmentTypeDetails(investment_type, fdi_type),
    sector,
    business_activities: businessActivities.join(', '),
    client_contacts: castArray(client_contacts).map(i => i.name).join(', '),
    description,
    anonymous_description,
    investor_type,
    level_of_involvement,
    specific_programme,
    estimated_land_date: !isEmpty(estimated_land_date) ? moment(estimated_land_date, 'YYYY-MM-DD').format('MMMM YYYY') : null,
  }
}

function transformBriefInvestmentSummary (data) {
  if (!isPlainObject(data)) { return }

  const investorCompany = data.investor_company
  const competitorCountries = data.competitor_countries || []
  const regionLocations = data.uk_region_locations || []

  return {
    sector: get(data, 'sector.name', null),
    investor_company: {
      name: investorCompany.name,
      url: `/companies/${investorCompany.id}`,
    },
    website: investorCompany.website ? {
      name: investorCompany.website,
      url: investorCompany.website,
    } : null,
    account_tier: (investorCompany.classification && investorCompany.classification !== null && investorCompany.classification.name) ? investorCompany.classification.name : 'None',
    uk_region_locations: regionLocations.map(region => region.name).join(', '),
    competitor_countries: competitorCountries.map(country => country.name).join(', '),
    estimated_land_date: !isEmpty(data.estimated_land_date) ? moment(data.estimated_land_date, 'YYYY-MM-DD').format('MMMM YYYY') : null,
    total_investment: formatCurrency(data.total_investment),
  }
}

module.exports = {
  transformToApi,
  transformFromApi,
  transformInvestmentDataForView,
  transformBriefInvestmentSummary,
}
