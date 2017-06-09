const moment = require('moment')
const { mapValues, get, isPlainObject } = require('lodash')
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

  return Object.assign({}, data, {
    investor_company: {
      name: data.investor_company.name,
      url: buildCompanyUrl(data.investor_company),
    },
    investment_type: data.investment_type.name,
    sector: get(data, 'sector.name', null),
    business_activities: data.business_activities.map(i => i.name).join(', '),
    nda_signed: data.nda_signed ? 'Signed' : 'Not signed',
    estimated_land_date: data.estimated_land_date ? moment(data.estimated_land_date).format('MMMM YYYY') : null,
  })
}

module.exports = {
  transformProjectDataForView,
  transformToApi,
  transformFromApi,
}
