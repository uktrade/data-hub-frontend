/* eslint-disable camelcase */
const { get } = require('lodash')

const labels = require('../labels')
const urls = require('../../../lib/urls')

const { addressToString } = require('../../../common/addresses')
const { formatLongDate, formatMediumDateTime } = require('../../../common/date')

module.exports = function transformCompanyToListItem({
  id,
  name,
  sector,
  uk_based,
  uk_region,
  trading_names,
  address,
  modified_on,
  headquarter_type,
  global_headquarters,
  latest_interaction_date,
} = {}) {
  if (!id) {
    return
  }

  const meta = []
  const metadata = []
  const badges = []

  if (trading_names && trading_names.length) {
    meta.push({
      label: labels.hqLabels.trading_names,
      value: trading_names,
    })
    metadata.push({
      label: labels.hqLabels.trading_names,
      value: trading_names.join(', '),
    })
  }

  if (sector) {
    const sectorMeta = {
      label: 'Sector',
      value: get(sector, 'name'),
    }
    meta.push(sectorMeta)
    metadata.push(sectorMeta)
  }

  if (address && address.country) {
    meta.push({
      label: 'Country',
      type: 'badge',
      value: get(address, 'country.name'),
    })
    badges.push({ text: get(address, 'country.name') })
  }

  if (uk_based) {
    meta.push({
      label: 'UK region',
      type: 'badge',
      value: get(uk_region, 'name'),
    })
    badges.push({ text: get(uk_region, 'name') })
  }

  if (headquarter_type) {
    const hqLabel = labels.hqLabels[get(headquarter_type, 'name')]
    meta.push({
      label: 'Headquarter type',
      type: 'badge',
      value: hqLabel,
    })
  }

  if (global_headquarters) {
    const { name: ghqName, id: ghqId } = global_headquarters
    const globalHqMeta = {
      label: 'Global HQ',
      value: ghqName,
      url: urls.companies.detail(ghqId),
    }

    meta.push(globalHqMeta)
    metadata.push(globalHqMeta)
  }

  if (latest_interaction_date) {
    meta.push({
      type: 'date',
      label: 'Last interaction date',
      value: latest_interaction_date,
    })
    metadata.push({
      type: 'date',
      label: 'Last interaction date',
      value: formatLongDate(latest_interaction_date),
    })
  }

  meta.push({
    type: 'address',
    label: labels.address.companyAddress,
    value: address,
  })

  metadata.push({
    label: labels.address.companyAddress,
    value: addressToString(address),
  })

  return {
    id,
    name,
    url: urls.companies.detail(id),
    meta,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    type: 'company',
    // For react collection list:
    headingUrl: urls.companies.detail(id),
    headingText: name,
    subheading: `Updated on ${formatMediumDateTime(modified_on)}`,
    badges: badges.filter((item) => item.text),
    metadata: metadata.filter((item) => item.value),
  }
}
