/* eslint camelcase: 0 */
const { isArray, assign, compact, pickBy } = require('lodash')

const labels = require('../labels')

function transformInvestmentProjectToListItem ({
  id,
  name,
  stage,
  investment_type,
  investor_company,
  estimated_land_date,
  sector,
  project_code,
}) {
  const metaItems = [
    { key: 'stage', value: stage, type: 'badge' },
    { key: 'investment_type', value: investment_type, type: 'badge', badgeModifier: 'secondary' },
    { key: 'investor_company', value: investor_company },
    { key: 'sector', value: sector },
    { key: 'estimated_land_date', value: estimated_land_date, type: 'dateMonthYear', isInert: true },
  ].map(({ key, value, type, badgeModifier, isInert }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier, isInert }), {
      label: labels.investmentProjectMetaItemLabels[key],
    })
  })

  return {
    id,
    name,
    subTitle: {
      value: project_code,
      label: 'Project code',
    },
    type: 'investment-project',
    meta: compact(metaItems),
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
  transformInvestmentListItemToDisableMetaLinks,
}
