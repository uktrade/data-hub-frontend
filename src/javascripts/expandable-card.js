/* eslint no-new: 0 */
const {
  hide,
  toggleVisible,
  toggleClass,
  addClass,
  createElementFromMarkup
} = require('../lib/element-stuff')

/**
 * Allow markup to indicate a hidden section containing sub
 * or detailed data. Simple toggles visibility of the section section
 *
 * @class ExpandableCard
 */
class ExpandableCard {
  constructor (element) {
    this.cacheElements(element)
    this.enhanceMarkup()
    this.initialState()
  }

  /**
   * Gets pointes to the important elements used throughout this code
   *
   * @param {HTMLElement} element
   *
   * @memberof ExpandableCard
   */
  cacheElements (element) {
    this.wrapperElement = element
    this.titleElement = element.querySelector('.card__title')
    this.subsectionElement = element.querySelector('.card__subsection')
  }

  /**
   * Turns the plain markup into the markup needed
   * for the control. Replaces the plain title
   * with a state inticator and title and listens for clicks to toggle visibility
   *
   *
   * @memberof ExpandableCard
   */
  enhanceMarkup () {
    const title = this.titleElement.innerText
    const enhancedTitleElement = createElementFromMarkup(`<a href="#${this.wrapperElement.id}" class="card__title">
      <span class="card__state-indicator"></span>
      <span class="card__title-text">${title}</span>
    </a>`)

    enhancedTitleElement.addEventListener('click', this.clickToggleButton.bind(this), true)
    this.wrapperElement.replaceChild(enhancedTitleElement, this.titleElement)
    this.titleElement = enhancedTitleElement
  }

  /**
   * Handle when a user clicks on the expansion button
   *
   *
   * @memberof ExpandableCard
   */
  clickToggleButton (event) {
    event.preventDefault()
    toggleVisible(this.subsectionElement)
    toggleClass(this.wrapperElement, 'is-open')
    event.target.blur()
  }

  /**
   * Set the intial visibilit of a section
   * If the page is called with a #, and that matches the id
   * of the wrapper then we leave this one open, otherwise close it
   * This is for when a person navigates back to a list from another page
   * and we want to restore the state.
   *
   * @memberof ExpandableCard
   */
  initialState () {
    // Get the url hash and the wrapper id to compare
    const hash = window.location.hash.substr(1)
    const id = this.wrapperElement.id

    // Does the id for this element match the hash, if so then
    // keep this open
    if (id && hash && id === hash) {
      addClass(this.wrapperElement, 'is-open')
      return
    }

    hide(this.subsectionElement)
  }
}

document.querySelectorAll('.card--expandable')
  .forEach((expandableCard) => new ExpandableCard(expandableCard))

module.exports = ExpandableCard
