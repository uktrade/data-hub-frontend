/* eslint no-new: 0 */
const axios = require('axios')
const { hide } = require('../lib/elementstuff')

class LookupAddress {

  constructor (elementSelector) {
    this.cacheElements(elementSelector)
    this.suggestions = []
    this.addEvents()
    hide(this.addressPostcodeField.parentNode)
  }

  cacheElements (elementSelector) {
    if (typeof elementSelector === 'string') {
      this.element = document.querySelector(elementSelector)
    } else {
      this.element = elementSelector
    }

    this.postcodeLookupField = this.element.querySelector('.postcode-lookup-field')
    this.postcodeLookupButton = this.element.querySelector('.postcode-lookup-button')
    this.address1Field = this.element.querySelector('[name*="_address_1"]')
    this.address2Field = this.element.querySelector('[name*="_address_2"]')
    this.addressTownField = this.element.querySelector('[name*="_address_town"]')
    this.addressCountyField = this.element.querySelector('[name*="_address_county"]')
    this.addressPostcodeField = this.element.querySelector('[name*="_address_postcode"]')
    this.addressSuggestionsWrapper = this.element.querySelector('.form-group--address-suggestions select')
    this.addressSuggestionsDropdown = this.element.querySelector('.form-group--address-suggestions select')
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
        var html = '<option value="">Please select an address</option>'
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
  }
}

const addressWrappers = document.querySelectorAll('.lookup-address-js')
for (let pos = 0; pos < addressWrappers.length; pos += 1) {
  const addressWrapper = addressWrappers.item(pos)
  new LookupAddress(addressWrapper)
}

module.exports = LookupAddress
