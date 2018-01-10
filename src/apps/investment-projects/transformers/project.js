/* eslint-disable camelcase */
const { get, isPlainObject, mapValues } = require('lodash')
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

function transformInvestmentDataForView (data) {
  if (!isPlainObject(data)) { return }

  const businessActivities = data.business_activities.slice()
  if (data.other_business_activity) {
    businessActivities.push({ name: data.other_business_activity })
  }

  return Object.assign({}, data, {
    investor_company: {
      name: data.investor_company.name,
      url: `/companies/${data.investor_company.id}`,
    },
    investment_type: getInvestmentTypeDetails(data.investment_type, data.fdi_type),
    sector: get(data, 'sector.name', null),
    business_activities: businessActivities.map(i => i.name).join(', '),
    client_contacts: data.client_contacts.map(i => i.name).join(', '),
    estimated_land_date: data.estimated_land_date ? moment(data.estimated_land_date).format('MMMM YYYY') : null,
  })
}

function transformBriefInvestmentSummary (data) {
  if (!isPlainObject(data)) { return }

  const investorCompany = data.investor_company
  const competitorCountries = data.competitor_countries || []
  const regionLocations = data.uk_region_locations || []
  const date = moment(data.estimated_land_date, 'YYYY-MM-DD')

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
    estimated_land_date: date.isValid() ? date.format('MMMM YYYY') : null,
    total_investment: formatCurrency(data.total_investment),
  }
}

module.exports = {
  transformToApi,
  transformFromApi,
  transformInvestmentDataForView,
  transformBriefInvestmentSummary,
}
