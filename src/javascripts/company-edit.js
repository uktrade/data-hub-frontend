/* eslint no-new: 0 */
const { hide, show } = require('../lib/element-stuff')
require('./lookup-address')
require('./sectors')

const tradingAddressWrapper = document.getElementById('trading-address-wrapper')
const showTradingButton = document.getElementById('add-trading-address')
const hideTradingButton = document.getElementById('remove-trading-address')
const tradingAddressFields = tradingAddressWrapper.querySelectorAll('input, select')
const tradingAddressCountryField = tradingAddressWrapper.querySelector('[name=trading_address_country]')
const registeredCountryField = document.querySelector('[name=registered_address_country]')
const registeredCountryId = (registeredCountryField) ? registeredCountryField.value : null

showTradingButton.addEventListener('click', function (event) {
  event.preventDefault()
  tradingAddressCountryField.value = registeredCountryId
  hide(showTradingButton)
  show(hideTradingButton)
  show(tradingAddressWrapper)
}, true)

hideTradingButton.addEventListener('click', function (event) {
  event.preventDefault()
  show(showTradingButton)
  hide(hideTradingButton)
  hide(tradingAddressWrapper)

  for (let index = 0; index < tradingAddressFields.length; index += 1) {
    tradingAddressFields.item(index).value = ''
  }
}, true)
