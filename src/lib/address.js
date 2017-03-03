const sentenceCase = require('./sentencecase')

function getFormattedAddress (object, key) {
  let addressStr = ''
  if (object[`${key}_address_1`] && object[`${key}_address_1`].length > 0) addressStr += sentenceCase(`${object[`${key}_address_1`]}, `)
  if (object[`${key}_address_2`] && object[`${key}_address_2`].length > 0) addressStr += sentenceCase(`${object[`${key}_address_2`]}, `)
  if (object[`${key}_address_town`] && object[`${key}_address_town`].length > 0) addressStr += sentenceCase(`${object[`${key}_address_town`]}, `)
  if (object[`${key}_address_county`] && object[`${key}_address_county`].length > 0) addressStr += sentenceCase(`${object[`${key}_address_county`]}, `)
  if (object[`${key}_address_postcode`] && object[`${key}_address_postcode`].length > 0) addressStr += `${object[`${key}_address_postcode`]}, `

  if (object[`${key}_address_country`] && object[`${key}_address_country`].name && object[`${key}_address_country`].name.length > 0) {
    addressStr += sentenceCase(object[`${key}_address_country`].name)
  } else if (addressStr.length > 0) {
    addressStr += 'United Kingdom'
  }

  return addressStr
}

module.exports = { getFormattedAddress }
