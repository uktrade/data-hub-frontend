const { get, isEqual } = require('lodash')

const labels = require('../labels')
const urls = require('../../../lib/urls')

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
  registered_address,
} = {}) {
  if (!id) {
    return
  }

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

  if (address && address.country) {
    meta.push({
      label: 'Country',
      type: 'badge',
      value: get(address, 'country.name'),
    })
  }

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
    meta.push({
      label: 'Global HQ',
      value: global_headquarters.name,
    })
  }

  meta.push({
    type: 'address',
    label: labels.address.companyAddress,
    value: address,
  })

  if (registered_address && !isEqual(registered_address, address)) {
    meta.push({
      type: 'address',
      label: labels.address.companyRegisteredAddress,
      value: registered_address,
    })
  }

  if (latest_interaction_date) {
    meta.push({
      type: 'date',
      label: 'Last interaction date',
      value: latest_interaction_date,
    })
  }

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
  }
}
