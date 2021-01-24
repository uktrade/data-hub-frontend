/* eslint camelcase: 0 */
const { isArray, assign, compact, pickBy } = require('lodash')
const { format } = require('date-fns')

const urls = require('../../../lib/urls')

// TODO: Remove labels when all collection lists are reworked into React.
const labels = require('../labels')
// end

function transformInvestmentProjectToListItem({
  id,
  name,
  project_code,
  stage,
  investment_type,
  status,
  investor_company,
  estimated_land_date,
  sector,
}) {
  const badges = [
    { text: stage.name },
    { text: investment_type.name },
    { text: status },
  ]

  const metadata = [
    { label: 'Investor', value: investor_company.name },
    { label: 'Sector', value: sector.name },
    {
      label: 'Estimated land date',
      value: estimated_land_date && format(estimated_land_date, 'MMMM YYYY'),
    },
  ].filter((metadata) => metadata.value)

  // TODO: Remove metaItems when all collection lists are reworked into React.
  const metaItems = [
    { key: 'stage', value: stage, type: 'badge' },
    {
      key: 'investment_type',
      value: investment_type,
      type: 'badge',
      badgeModifier: 'secondary',
    },
    { key: 'status', value: status, type: 'badge', badgeModifier: 'secondary' },
    { key: 'investor_company', value: investor_company },
    { key: 'sector', value: sector },
    {
      key: 'estimated_land_date',
      value: estimated_land_date,
      type: 'dateMonthYear',
      isInert: true,
    },
  ].map(({ key, value, type, badgeModifier, isInert }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier, isInert }), {
      label: labels.investmentProjectMetaItemLabels[key],
    })
  })
  // end

  return {
    // TODO: Remove all these props when all collection lists are reworked into React.
    id,
    name,
    type: 'investments/project',
    subTitle: {
      type: 'project',
      label: 'Project code',
      badges,
      value: project_code,
      metadata,
    },
    // end
    meta: compact(metaItems),
    headingUrl: urls.investments.projects.details(id),
    headingText: name,
    subheading: `Project code ${project_code}`,
    type: 'project',
    badges,
    metadata,
  }
}

function transformInvestmentListItemToDisableMetaLinks(item) {
  if (!isArray(item.meta)) {
    return item
  }

  const meta = item.meta.map((metaItem) => {
    return assign({}, metaItem, { isInert: true })
  })

  return assign({}, item, { meta })
}

module.exports = {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
}
