/* eslint new-cap: 0 */

require('babel-polyfill')
const getQueryParam = require('../lib/urlstuff').getQueryParam
const {toggleClass, show} = require('@uktrade/trade_elements').elementstuff

const term = getQueryParam('term')

class Facets {

  constructor (targetElement) {
    this.initElements(targetElement)
    this.addEventHandlers()
    show(targetElement)
  }

  initElements (targetElement) {
    this.element = targetElement
    this.clearButtons = this.element.querySelectorAll('.clear-filter-js')
    this.collapseButtons = this.element.querySelectorAll('.collapse-filter-js')
  }

  addEventHandlers () {
    this.element.addEventListener('click', this.selectOptionHandler, false)

    for (const clearButton of this.clearButtons) {
      clearButton.addEventListener('click', this.clearFacetSelection)
    }

    for (const collapseButton of this.collapseButtons) {
      collapseButton.addEventListener('click', this.toggleFacet)
    }
  }

  selectOptionHandler = () => {
    let url = `?term=${term}`

    const checkedInputs = this.element.querySelectorAll('input[type=checkbox]:checked')
    for (const input of checkedInputs) {
      url += `&${input.name}=${input.value}`
    }

    window.location.href = url
  };

  clearFacetSelection = (event) => {
    const facetWrapper = event.target.parentElement.parentElement.parentElement
    const checkedInputs = facetWrapper.querySelectorAll('input[type=checkbox]:checked')
    for (const input of checkedInputs) {
      input.checked = false
    }
    this.selectOptionHandler()
  };

  toggleFacet = (event) => {
    const facetWrapper = event.target.parentElement.parentElement.parentElement
    toggleClass(facetWrapper, 'collapse')

    const control = facetWrapper.querySelector('.collapse-filter-js')
    toggleClass(control, 'fa-chevron-up')
    toggleClass(control, 'fa-chevron-down')
  }

}

module.exports = Facets
