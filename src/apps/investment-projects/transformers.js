/* eslint camelcase: 0 */
const { get, isArray, assign, compact, pickBy } = require('lodash')
const queryString = require('query-string')
const labels = require('./labels')

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
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
}
