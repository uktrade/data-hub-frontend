/* eslint camelcase: 0 */
const { get, isArray, assign } = require('lodash')
const queryString = require('query-string')

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
  const meta = []

  if (stage) {
    meta.push({
      name: 'stage',
      label: 'Stage',
      value: stage,
      type: 'badge',
    })
  }
  if (investment_type) {
    meta.push({
      name: 'investment_type',
      label: 'Investment type',
      value: investment_type,
      type: 'badge',
      badgeModifier: 'secondary',
    })
  }
  if (investor_company) {
    meta.push({
      name: 'investor_company',
      label: 'Investor',
      value: investor_company,
    })
  }
  if (estimated_land_date) {
    meta.push({
      type: 'dateMonthYear',
      name: 'estimated_land_date',
      label: 'Land date',
      value: estimated_land_date,
      isInert: true,
    })
  }
  if (sector) {
    meta.push({
      name: 'sector',
      label: 'Sector',
      value: sector,
    })
  }

  return {
    id,
    name,
    type: 'investment-project',
    code: project_code,
    meta,
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
