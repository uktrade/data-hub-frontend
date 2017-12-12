/* eslint no-new: 0 */
const axios = require('axios')
const { closest, hide } = require('../lib/helpers')

class LookupAddress {
  constructor (elementSelector) {
    this.cacheElements(elementSelector)
    this.suggestions = []
    this.addEvents()
    hide(closest(this.addressPostcodeField, '.c-form-group'))

    this.postcodeLookupField.value = this.addressPostcodeField.value
  }

  cacheElements (elementSelector) {
    if (typeof elementSelector === 'string') {
      this.element = document.querySelector(elementSelector)
    } else {
      this.element = elementSelector
    }

    this.postcodeLookupField = this.element.querySelector('.c-form-control--PostcodeLookup')
    this.postcodeLookupButton = this.element.querySelector('.postcode-lookup-button')
    this.address1Field = this.element.querySelector('[name*="address_1"]')
    this.address2Field = this.element.querySelector('[name*="address_2"]')
    this.addressTownField = this.element.querySelector('[name*="address_town"]')
    this.addressCountyField = this.element.querySelector('[name*="address_county"]')
    this.addressPostcodeField = this.element.querySelector('[name*="address_postcode"]')
    this.addressCountryField = this.element.querySelector('[name*="address_country"]')
    this.addressSuggestionsDropdown = this.element.querySelector('.c-form-control--PostcodeLookupResult')
  }

  addEvents () {
    this.postcodeLookupButton.addEventListener('click', this.pressLookupButton, true)
    this.addressSuggestionsDropdown.addEventListener('change', this.selectAddressSuggestion, true)
  }

  pressLookupButton = (event) => {
    const postcode = this.postcodeLookupField.value
    axios.get(`/api/postcodelookup/${postcode}`)
      .then((response) => {
        this.suggestions = response.data
        var html = '<option value="">Select an address</option>'
        for (const index in this.suggestions) {
          const suggestion = this.suggestions[index]
          html += `<option value="${index}">${suggestion.address1}</option>`
        }
        this.addressSuggestionsDropdown.innerHTML = html
      })
  }

  selectAddressSuggestion = (event) => {
    if (event.target.value === '') {
      return
    }

    const index = parseInt(event.target.value)
    const suggestion = this.suggestions[index]
    this.address1Field.value = suggestion.address1
    this.address2Field.value = suggestion.address2
    this.addressTownField.value = suggestion.city
    this.addressCountyField.value = suggestion.county
    this.addressPostcodeField.value = suggestion.postcode
    this.addressCountryField.value = suggestion.country
  }
}

const addressWrappers = document.querySelectorAll('.lookup-address-js')
for (let pos = 0; pos < addressWrappers.length; pos += 1) {
  const addressWrapper = addressWrappers.item(pos)
  new LookupAddress(addressWrapper)
}

module.exports = LookupAddress
