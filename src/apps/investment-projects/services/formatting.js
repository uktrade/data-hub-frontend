const moment = require('moment')
const { compact, mapValues, get, isPlainObject, isNull } = require('lodash')
const { buildCompanyUrl } = require('../../companies/services/data')
const metadataRepository = require('../../../lib/metadata')

function formatCurrency (number) {
  if (isNull(number)) { return null }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(number)
}

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

function transformInvestmentDataForView (data) {
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

function transformInvestmentValueForView (data) {
  if (!isPlainObject(data)) { return }

  function formatBoolean (boolean, { suffix = '', pos = 'Yes', neg = 'No' }) {
    if (isNull(boolean)) { return null }
    return (data.government_assistance ? pos : neg) + suffix
  }

  return Object.assign({}, data, {
    total_investment: formatCurrency(data.total_investment),
    foreign_equity_investment: formatCurrency(data.foreign_equity_investment),
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
    sector_name: get(data, 'sector.name'),
    account_tier: get(data, 'investor_company.classification.name'),
    business_activities: data.business_activities.filter((activity) => {
      return /^(european|global) headquarters$/i.test(activity.name)
    }).length ? 'Yes' : 'No',
  })
}

function transformInvestmentRequirementsForView (data) {
  if (!isPlainObject(data)) { return }

  const strategicDrivers = get(data, 'strategic_drivers', [])
  const competitorCountries = get(data, 'competitor_countries', [])
  const regionLocations = get(data, 'uk_region_locations', [])

  return Object.assign({}, data, {
    strategic_drivers: strategicDrivers.map(driver => driver.name).join(', '),
    competitor_countries: competitorCountries.map(country => country.name).join(', '),
    uk_region_locations: regionLocations.map(region => region.name).join(', '),
    uk_company: get(data, 'uk_company.name'),
  })
}

function transformInvestmentFDIForView (data) {
  if (!isPlainObject(data)) {
    return
  }

  const [
    { name: commitmentToInvestName },
    { name: fdiName },
    { name: nonFdiName },
  ] = metadataRepository.investmentTypeOptions

  function approvedInvestmentText (investments, defaultText) {
    return investments.reduce((displayText, investmentDetail) => {
      return investmentDetail.isApproved ? investmentDetail.displayText : displayText
    }, defaultText)
  }

  return {
    type_of_investment: approvedInvestmentText([
      { displayText: commitmentToInvestName, isApproved: data.approved_commitment_to_invest },
      { displayText: fdiName, isApproved: data.approved_fdi },
      { displayText: nonFdiName, isApproved: data.approved_non_fdi },
    ], 'Does not apply'),
    foreign_investor: {
      name: data.investor_company.name,
      url: buildCompanyUrl(data.investor_company),
    },
    foreign_country: get(data, 'investor_company.registered_address_country.name'),
    uk_company: data.uk_company ? {
      name: data.uk_company.name,
      url: buildCompanyUrl(data.uk_company),
    } : null,
    investor_retain_voting_power: data.uk_company ? 'Yes' : 'No',
  }
}

function transformInvestmentLandingForView (data) {
  if (!isPlainObject(data)) {
    return
  }

  return Object.assign({}, {
    uk_company: data.uk_company ? { name: data.uk_company.name, url: buildCompanyUrl(data.uk_company) } : null,
    company_number: get(data, 'uk_company.company_number'),
    registered_address: data.uk_company ? [
      data.uk_company.registered_address_1,
      data.uk_company.registered_address_2,
      data.uk_company.registered_address_town,
      data.uk_company.registered_address_country.name,
      data.uk_company.registered_address_county,
      data.uk_company.registered_address_postcode,
    ].filter((address) => address) : null,
    investment_land_date: data.actual_land_date ? moment(data.actual_land_date).format('Do MMMM YYYY') : null,
  })
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
      url: buildCompanyUrl(investorCompany),
    },
    website: (investorCompany.website) ? `<a href="${investorCompany.website}">${investorCompany.website}</a>` : '',
    account_tier: (investorCompany.classification && investorCompany.classification !== null && investorCompany.classification.name) ? investorCompany.classification.name : 'None',
    uk_region_locations: regionLocations.map(region => region.name).join(', '),
    competitor_countries: competitorCountries.map(country => country.name).join(', '),
    estimated_land_date: data.estimated_land_date ? moment(data.estimated_land_date).format('MMMM YYYY') : null,
    total_investment: formatCurrency(data.total_investment),
  }
}

function getAdviserName (investmentData, key) {
  if (!get(investmentData, key)) {
    return 'To do'
  }

  const adviserName = get(investmentData, `${key}.first_name`, '') + ' ' + get(investmentData, `${key}.last_name`, '')
  return adviserName.trim()
}

function transformProjectManagementForView (investmentData) {
  if (investmentData.project_manager || investmentData.project_assurance_adviser) {
    return [{
      role: 'Project assurance adviser',
      adviser: getAdviserName(investmentData, 'project_assurance_adviser'),
      team: get(investmentData, 'project_assurance_team.name', null),
    }, {
      role: 'Project manager',
      adviser: getAdviserName(investmentData, 'project_manager'),
      team: get(investmentData, 'project_manager_team.name', null),
    }]
  }

  return null
}

function transformClientRelationshipManagementForView (investmentData) {
  const result = [{
    role: 'Client relationship manager',
    adviser: getAdviserName(investmentData, 'client_relationship_manager'),
    team: get(investmentData, 'client_relationship_manager.dit_team.name', null),
  }]

  const accountManager = get(investmentData, 'investor_company.account_manager.id', null)
  if (accountManager) {
    result.push({
      adviser: get(investmentData, 'investor_company.account_manager.name', null),
      role: 'Account manager',
      team: get(investmentData, 'investor_company.account_manager.dit_team.name', null),
    })
  }

  return result
}

module.exports = {
  transformInvestmentDataForView,
  transformInvestmentValueForView,
  transformInvestmentRequirementsForView,
  transformInvestmentFDIForView,
  transformInvestmentLandingForView,
  transformToApi,
  transformFromApi,
  transformBriefInvestmentSummary,
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
}
