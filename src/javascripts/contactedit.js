/* eslint no-new: 0 */
const { hide, show } = require('../lib/elementstuff')
require('./lookupaddress')

const addressWrapper = document.getElementById('address-wrapper')
const addressSameWrapper = document.getElementById('address-same-wrapper')
const addressIsSameRadio = document.getElementById('address-same-radio')
const address1 = document.querySelector('[name=address_1]')
const address2 = document.querySelector('[name=address_2]')
const addressTown = document.querySelector('[name=address_town]')
const addressCounty = document.querySelector('[name=address_county]')
const addressPostcode = document.querySelector('[name=address_postcode]')
const addressCountry = document.querySelector('[name=address_country]')

function updateAddressVisible () {
  if (addressIsSameRadio.checked === true) {
    hide(addressWrapper)
    address1.value = ''
    address2.value = ''
    addressTown.value = ''
    addressCounty.value = ''
    addressPostcode.value = ''
    addressCountry.value = ''
  } else {
    show(addressWrapper)
  }
}

addressSameWrapper.addEventListener('change', updateAddressVisible, true)

updateAddressVisible()
