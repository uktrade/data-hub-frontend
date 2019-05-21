/* eslint-disable camelcase */
const { get } = require('lodash')

const labels = require('../labels')

module.exports = function transformCompanyToListItem ({
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
} = {}) {
  if (!id) { return }

  const meta = []

  if (trading_names && trading_names.length) {
    meta.push({
      label: labels.hqLabels.trading_names,
      value: trading_names,
    })
  }

  if (sector) {
    meta.push({
      label: 'Sector',
      value: get(sector, 'name'),
    })
  }

  meta.push({
    label: 'Country',
    type: 'badge',
    value: address.country.name,
  })

  if (uk_based) {
    meta.push({
      label: 'UK region',
      type: 'badge',
      value: get(uk_region, 'name'),
    })
  }

  if (headquarter_type) {
    meta.push({
      label: 'Headquarter type',
      type: 'badge',
      value: labels.hqLabels[get(headquarter_type, 'name')],
    })
  }

  if (global_headquarters) {
    const { name: ghqName, id: ghqId } = global_headquarters

    meta.push({
      label: 'Global HQ',
      value: ghqName,
      url: `/companies/${ghqId}`,
    })
  }

  meta.push({
    type: 'address',
    label: labels.address.companyAddress,
    value: address,
  })

  const url = `/companies/${id}`

  return {
    id,
    name,
    url,
    meta,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    type: 'company',
  }
}
