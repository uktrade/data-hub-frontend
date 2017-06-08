/* eslint new-cap: 0 */
const { getQueryParam, buildQueryString } = require('../lib/url-helpers')
const { toggleClass, show } = require('../lib/element-stuff')

const term = getQueryParam('term')

class Facets {
  constructor (targetElement) {
    this.initElements(targetElement)
    this.addEventHandlers()
    show(targetElement)
  }

  initElements (targetElement) {
    this.element = targetElement
    this.clearButtons = Array.from(this.element.querySelectorAll('.js-clear-filter'))
    this.collapseButtons = Array.from(this.element.querySelectorAll('.js-collapse-filter'))
    this.checkboxInputs = Array.from(this.element.querySelectorAll('input[type=checkbox]'))
    this.collapsibleElem = this.element.querySelector('.js-collapsible')
  }

  addEventHandlers () {
    this.checkboxInputs.forEach((input) => {
      input.addEventListener('click', this.selectOptionHandler, false)
    })

    this.clearButtons.forEach((clearButton) => {
      clearButton.addEventListener('click', this.clearFacetSelection, false)
    })

    this.collapseButtons.forEach((collapseButton) => {
      collapseButton.addEventListener('click', this.toggleFacet, false)
    })
  }

  selectOptionHandler = (event) => {
    const input = event.target || event.srcElement
    const queryParams = {
      term: decodeURIComponent(term),
    }

    if (input.checked) {
      queryParams[input.name] = input.value
    }

    window.location.href = buildQueryString(queryParams)
  }

  clearFacetSelection = () => {
    const queryParams = {
      term: decodeURIComponent(term),
    }

    this.checkboxInputs.forEach((input) => {
      input.checked = false
    })

    window.location.href = buildQueryString(queryParams)
  }

  toggleFacet = () => {
    toggleClass(this.collapsibleElem, 'collapse')

    this.collapseButtons.forEach((collapseButton) => {
      toggleClass(collapseButton, 'fa-chevron-up')
      toggleClass(collapseButton, 'fa-chevron-down')
    })
  }
}

module.exports = Facets
