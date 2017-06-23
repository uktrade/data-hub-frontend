/* eslint-disable */
const AutocompleteBase = require('./autocompletebase')

// A Select autocomplete, turns an existing autocomplete into
// an autocomplete field. Changes you make update select.
class AutocompleteSelect extends AutocompleteBase {

  getOptions () {
    const options = {}
    const optionElements = this.element.querySelectorAll('option')
    for (let pos = 0; pos < optionElements.length; pos += 1) {
      const element = optionElements.item(pos)
      if (element.value.length > 0) {
        options[element.value] = element.innerHTML
      }
    }

    this.options = options
  }

  getCurrentValue () {
    if (!this.options) {
      this.getOptions()
    }

    this.value = this.element.value
    if (typeof this.options[this.value] !== 'undefined') {
      this.displayValue = this.options[this.value]
    } else {
      this.displayValue = ''
    }
  }

  getMatches (term, callback) {
    try {
      let matches = []

      for (const key of Object.keys(this.options)) {
        const option = this.options[key]
        if (option.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
          matches.push({ id: key, name: option })
        }
      }

      callback(null, matches)
    } catch (error) {
      callback(error)
    }
  }

  select (target) {
    if (!target) {
      target = this.suggestionsElement.querySelector(`.${this.ACTIVECLASS}`)
    }
    if (!target) return

    const value = target.getAttribute('data-value')
    const display = target.textContent
    this.element.value = value
    this.displayField.value = display
    this.hideSuggestions()
  }
}

if (typeof document !== 'undefined') {
  const selects = document.querySelectorAll('.select-autocomplete-js select')
  for (let pos = 0; pos < selects.length; pos += 1) {
    const select = selects.item(pos)
    new AutocompleteSelect(select)
  }
}

module.exports = AutocompleteSelect
