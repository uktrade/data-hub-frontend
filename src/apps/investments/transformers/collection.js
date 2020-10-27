/* eslint camelcase: 0 */
const { isArray, assign } = require('lodash')
const { format } = require('date-fns')

const urls = require('../../../lib/urls')

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

  return {
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
