/* eslint-disable */
require('es6-promise').polyfill()
const axios = require('axios')
const debounce = require('lodash/debounce')
const AutocompleteBase = require('./autocompletebase')

/* An Autocomplete field designed to store id's but lookup friendly display names
  and differs from the select autococomplete control in that it looks up the valids from a json endpoint.
  Use this variation when the list of items to lookup is too large to download to the browser

  Options are provided in the html markup as data attributes and the control is self registering

  Options

  data-lookup-url: The url for lookup queries to be sent to, the term entered will be added onto this
  data-display-value: The display value associated with the current ID
  value: current ID value

*/
class AutocompleteAjax extends AutocompleteBase {

  constructor (element) {
    super(element)
    this.baseUrl = this.element.getAttribute('data-lookup-url')
    this.displayField.value = this.element.getAttribute('data-display-value')
    this.getMatches = debounce(this.getMatches, 200)
  }

  getCurrentValue () {
    return this.element.value
  }

  getMatches (term, callback) {
    const url = `${this.baseUrl}${term}`
    axios.get(url)
    .then((response) => {
      callback(null, response.data)
    })
    .catch((error) => {
      callback(null, [])
    })
  }
}

if (typeof document !== 'undefined') {
  const elements = document.querySelectorAll('.ajax-autocomplete-js')
  for (let pos = 0; pos < elements.length; pos += 1) {
    const element = elements.item(pos)
    new AutocompleteAjax(element)
  }
}

module.exports = AutocompleteAjax
