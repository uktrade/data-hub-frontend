const { forEach, set, pick, get, assign } = require('lodash')

const { getButtonWithText } = require('../../../helpers/selectors')

module.exports = {
  elements: {
    postCodeLookupButton: getButtonWithText('Find UK address'),
    postCode: '#field-postcode-lookup',
    postCodeLookupSuggestions: '#field-postcode-address-suggestions',
    postCodeLookupAddress1: '#field-address_1',
    postCodeLookupAddress2: '#field-address_2',
    postCodeLookupTown: '#field-address_town',
    postCodeLookupCounty: '#field-address_county',
    postCodeLookupCountry: '#field-address_country',
    companyPostCode: '#field-registered_address_pcode_lookup',
    companyPostCodeLookupSuggestions: '#field-registered_address_pcode_result',
    companyPostCodeLookupAddress1: '#field-registered_address_1',
    companyPostCodeLookupAddress2: '#field-registered_address_2',
    companyPostCodeLookupTown: '#field-registered_address_town',
    companyPostCodeLookupCounty: '#field-registered_address_county',
  },
  commands: [
    {
      getAddressInputValues (postcode, stateStore, suggestionsElem, callback) {
        this
          .setValue(`@${get(stateStore, 'postcode')}`, postcode)
          .click('@postCodeLookupButton')
          .wait() // wait for xhr to come back for postcode lookup
          .api.perform((done) => {
            this.getListOption(suggestionsElem, (addressOption) => {
              this.setValue(suggestionsElem, addressOption)
              done()
            })
          })
          .perform((done) => {
            const promises = []
            // record information that has come from postcode lookup
            // select elements
            forEach(pick(stateStore, ['country']), (value, key) => {
              promises.push(new Promise((resolve) => {
                this.getValue(`@${value}`, (option) => {
                  this.getText(`#field-address_country option[value="${option.value.trim()}"]`, (optionText) => {
                    set(stateStore, key, optionText.value.trim())
                    resolve()
                  })
                })
              }))
            })
            // text inputs
            forEach(pick(stateStore, ['address1', 'address2', 'county', 'town']), (value, key) => {
              promises.push(new Promise((resolve) => {
                this.getValue(`@${value}`, (textInput) => {
                  set(stateStore, key, textInput.value.trim())
                  resolve()
                })
              }))
            })

            Promise.all(promises)
              .then(() => {
                callback(assign({}, stateStore, { postcode }))
                done()
              })
          })
      },
    },
  ],
}
