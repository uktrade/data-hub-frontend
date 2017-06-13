const {
  hide,
  toggleVisible,
  toggleClass,
  addClass,
} = require('../lib/element-stuff')

class ExpandableDetails {
  constructor (element) {
    this.hash = window.location.hash.substr(1)
    this.cacheElements(element)
    this.addListeners()

    this.setInitialState()
  }

  cacheElements (element) {
    this.element = element
    this.headingElement = element.querySelector('.js-details-heading')
    this.revealElement = element.querySelector('.js-details-reveal')
  }

  addListeners () {
    this.headingElement.addEventListener('click', this.toggle.bind(this), true)
  }

  toggle (event) {
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
}

document.querySelectorAll('.js-details-expandable')
  .forEach((element) => {
    return new ExpandableDetails(element)
  })

module.exports = ExpandableDetails
