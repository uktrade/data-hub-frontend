import accessibleAutocomplete from 'accessible-autocomplete'

const assign = require('lodash/assign')
const get = require('lodash/get')
const isString = require('lodash/isString')
const pickBy = require('lodash/pickBy')

function highlight (string, searchTerm, shouldMatchFullWord = false) {
  if (!isString(string) || !isString(searchTerm) || !searchTerm.trim()) {
    return string
  }

  try {
    // Remove regex characters from the search term
    // as they wont be in the result and will cause an error in the regular expression
    const cleanTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '') // $& means the whole matched string

    const regEx = new RegExp(`(${cleanTerm})${shouldMatchFullWord ? '\\b' : ''}`, 'gi')
    return string.replace(regEx, '<span class="u-highlight">$1</span>')
  } catch (error) {
    return string
  }
}

function suggest (query, populateResults) {
  const results = get(window, 'DIT.advisers', [])
  const filteredResults = results.filter(result => {
    const matches = [
      result.name,
      result.email,
      get(result, 'dit_team.name'),
    ]

    const filtered = matches.filter(match => {
      if (!match) {
        return false
      }

      return match.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })

    return filtered.length > 0
  })
  populateResults(filteredResults)
}

const Autocomplete = {
  defaults: {
    source: suggest,
    templates: {
      inputValue: (suggestion) => {
        return get(suggestion, 'name')
      },
      suggestion: (suggestion, query) => {
        const html = `
          <span class="autocomplete__option-title">${suggestion.name}</span>
          &lt;${suggestion.email}&gt;
          <span class="autocomplete__option-meta">${get(suggestion, 'dit_team.name')}</span>
        `
        return highlight(html, query)
      },
    },
  },

  init (wrapper = document, options) {
    this.wrapper = wrapper
    this.settings = assign({}, this.defaults, options)

    this.cacheEls()

    if (!this.element.querySelector('.autocomplete__wrapper')) {
      this.render()
    }
  },

  cacheEls () {
    this.label = this.wrapper.querySelector('label').getAttribute('for')
    this.element = this.wrapper.querySelector('.js-Autocomplete__element')
  },

  render () {
    accessibleAutocomplete(assign({}, this.settings, {
      element: this.element,
      id: this.label,
    }))
  },
}

module.exports = {
  init () {
    const elements = Array.from(document.querySelectorAll('.js-Autocomplete'))

    elements.forEach(element => {
      const settings = {
        defaultValue: element.getAttribute('data-default-value'),
        displayMenu: element.getAttribute('data-display-menu'),
        showAllValues: element.hasAttribute('data-show-all-values'),
      }

      Autocomplete.init(element, pickBy(settings, (setting) => {
        return setting !== null && setting !== undefined
      }))
    })
  },
}
