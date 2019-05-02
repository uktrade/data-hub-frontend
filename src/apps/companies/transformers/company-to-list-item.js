/* eslint-disable camelcase */
const { get } = require('lodash')

const labels = require('../labels')

function transformAddress ({
  address,
  trading_address_country,
  trading_address_county,
  trading_address_town,
  trading_address_postcode,
  trading_address_1,
  trading_address_2,
  registered_address_country,
  registered_address_county,
  registered_address_town,
  registered_address_postcode,
  registered_address_1,
  registered_address_2,
}) {
  if (address) {
    return {
      type: 'address',
      label: labels.address.companyAddress,
      value: address,
    }
  }

  if (trading_address_1 && trading_address_country) {
    return {
      type: 'address',
      label: labels.address.companyAddress,
      value: {
        line_1: trading_address_1,
        line_2: trading_address_2,
        town: trading_address_town,
        county: trading_address_county,
        postcode: trading_address_postcode,
        country: trading_address_country,
      },
    }
  }

  return {
    type: 'address',
    label: labels.address.companyRegisteredAddress,
    value: {
      line_1: registered_address_1,
      line_2: registered_address_2,
      town: registered_address_town,
      county: registered_address_county,
      postcode: registered_address_postcode,
      country: registered_address_country,
    },
  }
}

module.exports = function transformCompanyToListItem ({
  id,
  name,
  sector,
  uk_based,
  uk_region,
  trading_names,
  address,
  registered_address,
  trading_address_country,
  trading_address_county,
  trading_address_town,
  trading_address_postcode,
  trading_address_1,
  trading_address_2,
  registered_address_country,
  registered_address_county,
  registered_address_town,
  registered_address_postcode,
  registered_address_1,
  registered_address_2,
  modified_on,
  headquarter_type,
  global_headquarters,
  global_headquarters_archived,
  global_headquarters_duns_number,
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

  if (trading_address_country || registered_address_country) {
    meta.push({
      label: 'Country',
      type: 'badge',
      value: get(trading_address_country, 'name') || get(registered_address_country, 'name'),
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
    const { name: ghqName, id: ghqId } = global_headquarters

    meta.push({
      label: 'Global HQ',
      value: ghqName,
      url: `/companies/${ghqId}`,
    })

    if (!global_headquarters_archived && !global_headquarters_duns_number) {
      meta.push({
        label: '',
        value: 'Remove subsidiary',
        url: `/companies/${id}/hierarchies/ghq/remove`,
      })
    }
  }

  meta.push(transformAddress({
    address,
    registered_address,
    trading_address_country,
    trading_address_county,
    trading_address_town,
    trading_address_postcode,
    trading_address_1,
    trading_address_2,
    registered_address_country,
    registered_address_county,
    registered_address_town,
    registered_address_postcode,
    registered_address_1,
    registered_address_2,
  }))

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
