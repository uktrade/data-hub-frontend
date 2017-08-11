const { get, isArray } = require('lodash')
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
  return {
    id,
    name,
    type: 'investment-project',
    code: project_code,
    meta: [
      {
        name: 'stage',
        label: 'Stage',
        value: stage,
        type: 'badge',
      },
      {
        name: 'investment_type',
        label: 'Investment type',
        value: investment_type,
        type: 'badge',
        badgeModifier: 'secondary',
      },
      {
        name: 'investor_company',
        label: 'Investor',
        value: investor_company,
      }, {
        type: 'date',
        name: 'estimated_land_date',
        label: 'Estimated to land',
        value: estimated_land_date,
        isInert: true,
      }, {
        name: 'sector',
        label: 'Sector',
        value: sector,
      },
    ],
  }
}

function transformInvestmentListItemToHaveMetaLinks (item, query = {}) {
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

module.exports = {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
}
