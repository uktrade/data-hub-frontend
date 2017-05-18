/* eslint new-cap: 0 */
const getQueryParam = require('../lib/url-stuff').getQueryParam
const {toggleClass, show} = require('../lib/element-stuff')

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

    for (let pos = 0; pos < this.clearButtons; pos += 1) {
      const clearButton = this.clearButtons.item(pos)
      clearButton.addEventListener('click', this.clearFacetSelection)
    }

    for (let pos = 0; pos < this.collapseButtons; pos += 1) {
      const collapseButton = this.collapseButtons.item(pos)
      collapseButton.addEventListener('click', this.toggleFacet)
    }
  }

  selectOptionHandler = () => {
    let url = `?term=${term}`

    const checkedInputs = this.element.querySelectorAll('input[type=checkbox]:checked')
    for (let pos = 0; pos < checkedInputs.length; pos += 1) {
      const input = checkedInputs.item(pos)
      url += `&${input.name}=${input.value}`
    }

    window.location.href = url
  };

  clearFacetSelection = (event) => {
    const facetWrapper = event.target.parentElement.parentElement.parentElement
    const checkedInputs = facetWrapper.querySelectorAll('input[type=checkbox]:checked')
    for (let pos = 0; pos < checkedInputs.length; pos += 1) {
      const input = checkedInputs.item(pos)
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
