/* eslint-disable camelcase */

const moment = require('moment')
const format = require('date-fns/format')
const queryString = require('query-string')
const { assign, compact, get, isArray, isPlainObject, isNull, mapValues, pickBy } = require('lodash')

const labels = require('../labels')

function formatCurrency (number) {
  if (isNull(number)) { return null }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(number)
}

function getInvestmentTypeDetails (investment_type, fdi_type) {
  const types = [
    investment_type.name,
    get(fdi_type, 'name'),
  ]
  return compact(types).join(', ')
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

function transformInvestmentValueForView ({
  client_cannot_provide_total_investment,
  total_investment,
  client_cannot_provide_foreign_investment,
  foreign_equity_investment,
  number_new_jobs,
  number_safeguarded_jobs,
  government_assistance,
  r_and_d_budget,
  average_salary,
  new_tech_to_uk,
  export_revenue,
  sector,
  investor_company,
  business_activities,
  non_fdi_r_and_d_budget,
  id,
  associated_non_fdi_r_and_d_project,
}) {
  function formatBoolean (boolean, { pos, neg }) {
    if (isNull(boolean)) { return null }
    return boolean ? pos : neg
  }

  const europeanOrGlobalHeadquartersBusinessActivities = business_activities.filter((activity) => {
    return /^(european|global) headquarters$/i.test(activity.name)
  })

  return {
    total_investment: client_cannot_provide_total_investment
      ? 'Client cannot provide this information'
      : formatCurrency(total_investment),
    foreign_equity_investment: client_cannot_provide_foreign_investment
      ? 'Client cannot provide this information'
      : formatCurrency(foreign_equity_investment),
    number_new_jobs: number_new_jobs && `${number_new_jobs} new jobs`,
    number_safeguarded_jobs: number_safeguarded_jobs && `${number_safeguarded_jobs} safeguarded jobs`,
    government_assistance: formatBoolean(government_assistance, {
      pos: 'Has government assistance',
      neg: 'No government assistance',
    }),
    r_and_d_budget: formatBoolean(r_and_d_budget, {
      pos: 'Has R&D budget',
      neg: 'No R&D budget',
    }),
    new_tech_to_uk: formatBoolean(new_tech_to_uk, {
      pos: 'Has new-to-world tech, business model or IP',
      neg: 'No new-to-world tech, business model or IP',
    }),
    export_revenue: formatBoolean(export_revenue, {
      pos: 'Yes, will create significant export revenue',
      neg: 'No, will not create significant export revenue',
    }),
    average_salary: get(average_salary, 'name'),
    sector_name: get(sector, 'name'),
    account_tier: get(investor_company, 'classification.name'),
    business_activities: europeanOrGlobalHeadquartersBusinessActivities.length ? 'Yes' : 'No',
    associated_non_fdi_r_and_d_project: non_fdi_r_and_d_budget
      ? transformAssociatedProject({ id, associated_non_fdi_r_and_d_project })
      : 'Not linked to a non-FDI R&D project',
  }
}

function transformAssociatedProject ({
  id,
  associated_non_fdi_r_and_d_project,
}) {
  if (isPlainObject(associated_non_fdi_r_and_d_project)) {
    const { name, project_code } = associated_non_fdi_r_and_d_project

    return {
      name,
      actions: [{
        label: 'Edit project',
        url: `/investment-projects/${id}/edit-associated?term=${project_code}`,
      }, {
        label: 'Remove association',
        url: `/investment-projects/${id}/remove-associated`,
      }],
    }
  }

  return {
    name: 'Find project',
    url: `/investment-projects/${id}/edit-associated`,
  }
}

function transformInvestmentRequirementsForView (data) {
  if (!isPlainObject(data)) { return }

  const strategicDrivers = get(data, 'strategic_drivers', [])
  const competitorCountries = get(data, 'competitor_countries', [])
  const regionLocations = get(data, 'uk_region_locations', [])
  const uk_company = transformUKCompany(data)

  return Object.assign({}, data, {
    strategic_drivers: strategicDrivers.map(driver => driver.name).join(', '),
    competitor_countries: competitorCountries.map(country => country.name).join(', '),
    uk_region_locations: regionLocations.map(region => region.name).join(', '),
    uk_company,
  })
}

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

function transformInvestmentFDIForView ({
  investment_type,
  fdi_type,
  investor_company,
  uk_company,
}) {
  return {
    type_of_investment: getInvestmentTypeDetails(investment_type, fdi_type),
    foreign_investor: {
      name: investor_company.name,
      url: `/companies/${investor_company.id}`,
    },
    foreign_country: get(investor_company, 'registered_address_country.name'),
    uk_company: uk_company ? {
      name: uk_company.name,
      url: `/companies/${uk_company.id}`,
    } : null,
    investor_retain_voting_power: uk_company ? 'Yes' : 'No',
  }
}

function transformInvestmentLandingForView (data) {
  if (!isPlainObject(data)) {
    return
  }

  return Object.assign({}, {
    uk_company: data.uk_company ? { name: data.uk_company.name, url: `/companies/${data.uk_company.id}` } : null,
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

function transformTeamMembersForView ({ adviser, role }) {
  return {
    adviser: get(adviser, 'name'),
    team: get(adviser, 'dit_team.name'),
    role: role,
  }
}

function transformInvestmentProjectToListItem ({
  id,
  name,
  project_code,
  stage,
  investment_type,
  investor_company,
  estimated_land_date,
  sector,
}) {
  const metaItems = [
    { key: 'stage', value: stage, type: 'badge' },
    { key: 'investment_type', value: investment_type, type: 'badge', badgeModifier: 'secondary' },
    { key: 'investor_company', value: investor_company },
    { key: 'estimated_land_date', value: estimated_land_date, type: 'dateMonthYear', isInert: true },
    { key: 'sector', value: sector },
  ].map(({ key, value, type, badgeModifier, isInert }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier, isInert }), {
      label: labels.investmentProjectMetaItemLabels[key],
    })
  })

  return {
    id,
    name,
    type: 'investment-project',
    code: project_code,
    meta: compact(metaItems),
  }
}

function transformInvestmentListItemToHaveMetaLinks (query = {}) {
  return function transformListItem (item) {
    if (!isArray(item.meta)) { return item }

    item.meta.forEach(metaItem => {
      const name = metaItem.name
      const itemQuery = Object.assign(
        {},
        query,
        {
          custom: true,
          [name]: get(metaItem, 'value.id', metaItem.value),
        },
      )

      if (!metaItem.isInert) {
        metaItem.url = `?${queryString.stringify(itemQuery)}`
        metaItem.isSelected = !!query[name]
      }
    })

    return item
  }
}

function transformInvestmentListItemToDisableMetaLinks (item) {
  if (!isArray(item.meta)) { return item }

  const meta = item.meta.map(metaItem => {
    return assign({}, metaItem, { isInert: true })
  })

  return assign({}, item, { meta })
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
  transformTeamMembersForView,
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
}
