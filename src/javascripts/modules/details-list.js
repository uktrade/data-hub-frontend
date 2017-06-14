const {
  hide,
  toggleVisible,
  toggleClass,
  addClass,
} = require('../../lib/element-stuff')

class ExpandableDetails {
  constructor (element) {
    this.hash = window.location.hash.substr(1)

    this.cacheElements(element)
    this.attachEvents()
    this.setInitialState()
  }

  cacheElements (element) {
    this.element = element
    this.headingElement = element.querySelector('.js-details-heading')
    this.revealElement = element.querySelector('.js-details-reveal')
  }

  attachEvents () {
    this.headingElement.addEventListener('click', this.handleToggleClick.bind(this))
  }

  handleToggleClick (event) {
    event.preventDefault()

    this.headingElement.blur()
    toggleVisible(this.revealElement)
    toggleClass(this.element, 'is-open')
  }

  setInitialState () {
    hide(this.revealElement)

    if (this.element.id === this.hash) {
      addClass(this.element, 'is-open')
    }
  }

  static init () {
    document.querySelectorAll('.js-details-expandable')
      .forEach((element) => new ExpandableDetails(element))
  }
}

module.exports = ExpandableDetails
