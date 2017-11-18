const { title } = require('case')

function getFormattedAddress (object, key) {
  if (key) {
    key = `${key}_`
  } else {
    key = ''
  }

  let addressStr = ''
  if (object[`${key}address_1`] && object[`${key}address_1`].length > 0) addressStr += title(`${object[`${key}address_1`]}, `)
  if (object[`${key}address_2`] && object[`${key}address_2`].length > 0) addressStr += title(`${object[`${key}address_2`]}, `)
  if (object[`${key}address_town`] && object[`${key}address_town`].length > 0) addressStr += title(`${object[`${key}address_town`]}, `)
  if (object[`${key}address_county`] && object[`${key}address_county`].length > 0) addressStr += title(`${object[`${key}address_county`]}, `)
  if (object[`${key}address_postcode`] && object[`${key}address_postcode`].length > 0) addressStr += `${object[`${key}address_postcode`]}, `

  if (object[`${key}address_country`] && object[`${key}address_country`].name && object[`${key}address_country`].name.length > 0) {
    addressStr += title(object[`${key}address_country`].name)
  }

  if (addressStr.length === 0) {
    return null
  }

  return addressStr
    .trim()
    .replace(/,$/, '')
}

module.exports = { getFormattedAddress }
