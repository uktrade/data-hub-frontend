const moment = require('moment')
const { compact, mapValues, get, isPlainObject, isNull } = require('lodash')
const { buildCompanyUrl } = require('./company.service')

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
    'non_fdi_type': Object,
    'sector': Object,
    'client_contacts': Array,
    'business_activities': Array,
  }

  const relationshipMgr = body['is-relationship-manager']
  if (relationshipMgr !== 'No') {
    body.client_relationship_manager = relationshipMgr
  }

  const referralSource = body['is-referral-source']
  if (referralSource !== 'No') {
    body.referral_source_adviser = referralSource
  }

  const formatted = mapValues(schema, (type, key) => {
    const value = body[key]

    if (!value) {
      return
    }

    if (type === Array) {
      return [{ id: value }]
    }

    return { id: value }
  })

  formatted['estimated_land_date'] = `${body['land-date_year']}-${body['land-date_month']}-01`

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
    'non_fdi_type': String,
    'sector': String,
    'client_contacts': Array,
    'business_activities': Array,
  }

  const formatted = mapValues(schema, (type, key) => {
    if (type === Array) {
      return get(body, `${key}[0].id`, '')
    }
    return get(body, `${key}.id`)
  })

  const date = new Date(body['estimated_land_date'])
  if (date) {
    formatted['land-date_year'] = date.getFullYear()
    formatted['land-date_month'] = date.getMonth() + 1 // month is zero based index
  }

  return Object.assign({}, body, formatted)
}

function transformProjectDataForView (data) {
  if (!isPlainObject(data)) { return }

  function getInvestmentTypeDetails () {
    const types = [
      data.investment_type.name,
      get(data, 'fdi_type.name'),
      get(data, 'non_fdi_type.name'),
    ]
    return compact(types).join(', ')
  }

  return Object.assign({}, data, {
    investor_company: {
      name: data.investor_company.name,
      url: buildCompanyUrl(data.investor_company),
    },
    investment_type: getInvestmentTypeDetails(),
    sector: get(data, 'sector.name', null),
    business_activities: data.business_activities.map(i => i.name).join(', '),
    nda_signed: data.nda_signed ? 'Signed' : 'Not signed',
    estimated_land_date: data.estimated_land_date ? moment(data.estimated_land_date).format('MMMM YYYY') : null,
  })
}

function transformProjectValueForView (data) {
  if (!isPlainObject(data)) { return }

  function formatNumber (number) {
    if (isNull(number)) { return null }

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(number)
  }

  function formatBoolean (boolean, { suffix = '', pos = 'Yes', neg = 'No' }) {
    if (isNull(boolean)) { return null }
    return (data.government_assistance ? pos : neg) + suffix
  }

  return Object.assign({}, data, {
    total_investment: formatNumber(data.total_investment),
    foreign_equity_investment: formatNumber(data.foreign_equity_investment),
    number_new_jobs: data.number_new_jobs && `${data.number_new_jobs} new jobs`,
    number_safeguarded_jobs: data.number_safeguarded_jobs && `${data.number_safeguarded_jobs} safeguarded jobs`,
    government_assistance: formatBoolean(data.government_assistance, { pos: 'Has', suffix: ' government assistance' }),
    r_and_d_budget: formatBoolean(data.r_and_d_budget, { pos: 'Has', suffix: ' R&D budget' }),
    average_salary: get(data, 'average_salary.name'),
    non_fdi_r_and_d_budget: formatBoolean(data.non_fdi_r_and_d_budget, {
      pos: 'Has',
      suffix: ' linked non-FDI R&D projects',
    }),
    new_tech_to_uk: formatBoolean(data.new_tech_to_uk, {
      pos: 'Has',
      suffix: ' new-to-world tech, business model or IP',
    }),
    export_revenue: formatBoolean(data.export_revenue, {
      pos: 'Yes, will',
      neg: 'No, will not',
      suffix: ' create significant export revenue',
    }),
  })
}

function transformProjectRequirementsForView (data) {
  if (!isPlainObject(data)) { return }

  const strategicDrivers = get(data, 'strategic_drivers', [])
  const competitorCountries = get(data, 'competitor_countries', [])
  const regionLocations = get(data, 'uk_region_locations', [])

  return Object.assign({}, data, {
    strategic_drivers: strategicDrivers.map(driver => driver.name).join(', '),
    competitor_countries: competitorCountries.map(country => country.name).join(', '),
    uk_region_locations: regionLocations.map(region => region.name).join(', '),
  })
}

function formatProjectTeamData (data) {
  return {
    client_relationship_manager: data.client_relationship_manager,
    referral_source_adviser: data.referral_source_adviser,
  }
}

module.exports = {
  transformProjectDataForView,
  transformProjectValueForView,
  transformProjectRequirementsForView,
  transformToApi,
  transformFromApi,
  formatProjectTeamData,
}
